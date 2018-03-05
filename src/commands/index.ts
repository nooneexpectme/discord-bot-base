import { Core as QueenDecimCore } from "@root/index";
import * as DiscordJS from "discord.js";
import * as StringArgv from "string-argv";
import Logger, { Danger, Success } from "@utils/logger";
import { exists } from "async-file";

export default class Commands {
    private core: QueenDecimCore;
    private registry: string[]  = [];
    private commands: {[name: string]: CommandModel} = {};

    constructor(core: QueenDecimCore){ this.core = core; }

    // Register
    public async registerOne(path: string): Promise<boolean> {
        Logger(`<RegisterOne> Trying to register "${path}".`);
        let errors = {
            already_registered: this.registry.indexOf(path) > -1,
            not_found: !(await exists(path))
        };
        if(errors.already_registered) Danger(`<RegisterOne> "${path}" Already registered.`);
        else if(errors.not_found) Danger(`<RegisterOne> "${path}" not found.`);
        else {
            this.registry.push(path);
            Success(`<RegisterOne> "${path}" registered.`);
            return true;
        }
        return false;
    }

    public async register(paths: string|string[]): Promise<boolean> {
        if(!Array.isArray(paths)) paths = [paths];
        let registers = await Promise.all(paths.map(path => this.registerOne(path)));
        return registers.indexOf(true) > -1;
    }

    // Unregister
    public unRegisterOne(path: string): boolean {
        let pathIndex = this.registry.indexOf(path);
        if(pathIndex === -1) return false
        this.registry.splice(pathIndex, 1);
        Logger(`<UnRegister> Unregistered path "${path}".`);
        return true;
    }

    public unRegister(paths: string|string[]){
        if(!Array.isArray(paths)) paths = [paths];
        let unregisters = paths.map(path => this.unRegisterOne(path));
        return unregisters.indexOf(true) > -1;
    }

    public unRegisterAll(){ return this.unRegister(this.registry); }

    // Load
    public load(name: string): boolean {
        return false;
    }

    // Unload
    public unload(name: string): boolean {
        return false;
    }

    // Reload
    public reload(name: string): boolean {
        return true;
    }

    // Access to registry
    public getNames(){ return Object.keys(this.commands); }
    public getByName(name: string): (boolean|CommandEntry) {
        return true;
    }

    // Message validator
    public isRequestMessage(content: string): boolean { return content.startsWith(this.core.settings.trigger, 0); }
    public getRequestInformations(content: string): CommandRequest {
        content = content.replace(this.core.settings.trigger, "").trim();
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

export class CommandModel {
    private core: QueenDecimCore;
    public settings: CommandSettings;

    constructor(core: QueenDecimCore, settings: CommandSettings){
        this.core = core;
        this.settings = settings;
    };

    async run(message: DiscordJS.Message, args: any[]): Promise<boolean> {
        message.reply("Default command initialized, please set-up the run function.");
        return true;
    };
}