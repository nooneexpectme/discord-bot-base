// Register aliases
import { addAliases as ModuleAliases } from "module-alias";
ModuleAliases({
    "@root": __dirname,
    "@utils": __dirname + "/utils"
})

// Imports
import * as DiscordJS from "discord.js";
import Commands, { CommandModel } from "./commands";
import { EventEmitter } from "events";

import Logger, { Danger } from "@utils/logger";
import ExecutionTime from "@utils/executionTime";

// Events const
const Events = {
    CONNECTED: "ServerConnected",
    ERROR: "ServerError",
    DISCONNECTED: "ServerDisconnected"
}

// Core
class Core {
    public dispatcher: EventEmitter = new EventEmitter();
    public settings: QueenDecimSettings;
    public client: DiscordJS.Client = new DiscordJS.Client();
    public commands: Commands;

    constructor(settings: QueenDecimSettings){
        // Save settings
        this.settings = settings;
        this.commands = new Commands(this);

        // Handle main messages
        this.client.on("ready", () => this.handleBotReady().catch(this.handleBotError.bind(this)));
        this.client.on("message", message => {
            this.handleNewMessage(message)
            .then(([isCommand, executionTime]) => {
                if(isCommand)
                    Logger(`The previous command has been executed in ${executionTime}ms.`);
            })
            .catch(error => this.handleBotError(error, message));
        });
        this.client.on("disconnect", () => this.dispatcher.emit(Events.DISCONNECTED));
    }

    public logIn(): Promise<string> { return this.client.login(this.settings.token); }
    public logOut(): Promise<any> { return this.client.destroy(); }

    private async handleBotError(error: any, message?: DiscordJS.Message){
        Danger("An error has occured.");
        this.dispatcher.emit(Events.ERROR, error);

        // Throw error in PM
        if(this.settings.throwErrorPM === false) return false;
        let embed = new DiscordJS.RichEmbed()
        .setColor("#C0392B")
        .setFooter("See more details in console.")
        .setTimestamp();
            
        if(this.settings.owner){
            // Throw in PM
            embed
            .setTitle("Internal server error")
            .setDescription(error);
            await Promise.all([
                this.client.users.get(this.settings.owner).send({ embed }),
                message.channel.send("Thanks you, we just found a new error.")
            ]);
        } else {
            // Warning in the server
            Danger("Please, set-up the OWNER option or disable throwErrorPM.");
            embed.addField("Warning", "If you are the owner of this bot, please set-up the `owner` option with your ID, if it's not you, please alert him.");
            embed.addField("Error reported", "The error has been reported in the console.");
            await message.channel.send({ embed });
        }
    }

    private async handleBotReady(){
        // Update bot settings
        Logger("QueenDecim is ready to fire.");

        // Register commands from settings
        if(this.settings.commandsAutoRegister && this.settings.commands && this.settings.commands.length > 0){
            Logger(this.settings.commands.length, "command(s) found.");            
            await this.commands.registerList(this.settings.commands);
            if(this.settings.commandsAutoLoad)
                await this.commands.loadRegistry();
        }

        this.dispatcher.emit(Events.CONNECTED);
        return true;
    }

    private async handleNewMessage(message: DiscordJS.Message): Promise<[boolean, number]> {
        if(!this.commands.isRequestMessage(message.content)) return [false, 0];
        
        // Send loading message
        let loading = <DiscordJS.Message>await message.channel.send("Please wait while i execute the command..."),
            executionTime = new ExecutionTime();

        // Execute the command
        Logger("New command received", message.content);
        let runState = await this.commands.run(message)
        .catch(error => {
            loading.delete();
            throw new Error(error);
        })
        if(!runState) message.reply("the command seems unexistant... try again.");

        // Return the command result
        let stopedAt = executionTime.stop();
        await loading.edit(`Command executed in ${stopedAt}ms.`);
        loading.delete(2500);
        return [true, stopedAt];
    }
}

export { DiscordJS, Core, CommandModel, Events };