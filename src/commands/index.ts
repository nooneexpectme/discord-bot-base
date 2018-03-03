import { Core as QueenDecimCore } from "@root/index";
import * as DiscordJS from "discord.js";
import * as StringArgv from "string-argv";
import Logger from "@utils/logger";

export default class Commands {
    private core: QueenDecimCore;
    private commands: {[name: string]: CommandEntry} = {};

    constructor(core: QueenDecimCore){
        this.core = core;

        // Register commands from settings
        if(core.settings.commands && core.settings.commands.length > 0){
            for(let command of core.settings.commands){
                let infos: CommandBaseInformations = command.infos();
                this.register(infos.command, infos.description, command);
            }
        }

        // Default command: help
        this.register("help", "Show informations about all registered plugins.", class {
            private core: QueenDecimCore;
            constructor(core: QueenDecimCore){ this.core = core; }
            async run(message: DiscordJS.Message, args: any[]){
                message.reply("please try again in two years.");
            }
        })
    }

    // Registr
    public exists(name: string): boolean { return this.commands[name.toLowerCase()] !== undefined; }
    public register(name: string, description: string, Manager: any): boolean {
        if(this.exists(name)) return false;
        Logger(`<Register command> ${name} - ${description}.`);
        let command: CommandEntry = { name, description, instance: new Manager(this.core) };
        this.commands[name.toLowerCase()] = command;
        return true;
    }
    public unregister(name: string): boolean {
        if(!this.exists(name)) return false
        Logger(`<Unregister command> ${name}.`);
        delete this.commands[name.toLowerCase()];
        return true;
    }
    public reload(name: string): boolean {
        if(!this.exists(name)) return false;
        
        return true;
    }

    // Access to registry
    public getNames(){ return Object.keys(this.commands); }
    public getByName(name: string): (boolean|CommandEntry) {
        if(!this.exists(name)) return false;
        return this.commands[name];
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