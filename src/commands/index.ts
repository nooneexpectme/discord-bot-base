import { Client as QueenDecimClient } from "@root/index";
import * as DiscordJS from "discord.js";
import * as StringArgv from "string-argv";
import Logger, { Danger, Success } from "@utils/logger";

import CommandEntry from "./entry";
import CommandModel from "./model";

export { CommandModel };

export default class Commands {
    private client: QueenDecimClient;
    private commands: CommandEntry[] = [];

    constructor(client: QueenDecimClient){ this.client = client; }

    // Register
    // TODO: Check for duplications commands name
    private _register(command: any): CommandEntry {
        let entry = new CommandEntry(command, this.client);
        if(!entry.isValidClass) return null;
        this.commands.push(entry);
        return entry;
    }

    public register(commands: any|any[]): CommandEntry|CommandEntry[] {
        if(!Array.isArray(commands)) commands = [commands];
        let registers = commands.map(command => this._register(command));
        return commands.length === 1 ? registers[0] : registers;
    }

    // Global commands (registry)
    public async unregisterAll(): Promise<boolean> {
        let unregisters = await Promise.all(this.commands.map(command => command.unload()));
        for(let i in unregisters)
            if(unregisters[i])
                delete this.commands[i];
        return this.commands.length === 0;
    }

    // Global commands (load/unload/reload)
    public async loadRegistry(withoutCaching: boolean = false): Promise<boolean> {
        let loadings = await Promise.all(this.commands.map(command => command.load()));
        return loadings.indexOf(false) === -1;
    }
    public async unloadRegistry(): Promise<boolean> {
        let unloadings = await Promise.all(this.commands.map(command => command.unload()));
        return unloadings.indexOf(false) === -1;
    }
    public async reloadRegistry(withoutCaching: boolean = false): Promise<boolean> {
        let unloadings = await this.unloadRegistry();
        if(!unloadings) return false;
        return await this.loadRegistry(withoutCaching);
    }

    // Access to registry
    public getNames(): string[] { return this.commands.map(command => command.instance.settings.name.trim()); }
    public getByName(name: string): CommandEntry {
        return this.commands
        .find(command => {
            let commandName = command.instance.settings.name;
            return commandName.trim().toLowerCase() === name.trim().toLowerCase();
        });
    }

    // Message validator
    public isRequestMessage(content: string): boolean { return content.startsWith(this.client.settings.prefix, 0); }
    public getRequestInformations(content: string): CommandRequest {
        content = content.replace(this.client.settings.prefix, "").trim();
        if(!content.length) return { command: null, arguments: null };
        let cmd = (new RegExp(/([a-zA-Z0-9]+)/, "g")).exec(content);
        content = content.replace(cmd[0], "").trim();
        return { command: cmd[1], arguments: StringArgv(content) };
    }

    // Execute query
    public async run(message: DiscordJS.Message): Promise<boolean> {
        let informations = this.getRequestInformations(message.content),
            command = <CommandEntry>this.getByName(informations.command);
        if(!command) return false;
        await command.instance.run(message, informations.arguments);
        return true;
    }
}