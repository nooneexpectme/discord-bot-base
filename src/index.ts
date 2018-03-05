require("module-alias/register");

import * as DiscordJS from "discord.js";
import Commands, { CommandModel } from "./commands";

import Logger, { Danger } from "@utils/logger";
import ExecutionTime from "@utils/executionTime";

class Core {
    public settings: QueenDecimSettings;
    public client: DiscordJS.Client = new DiscordJS.Client();
    public commands: Commands;

    constructor(settings: QueenDecimSettings){
        // Save settings
        this.settings = settings;
        this.commands = new Commands(this);

        // Handle main messages
        this.client.on("ready", () => this.handleBotReady().catch(console.error));
        this.client.on("message", message => {
            this.handleNewMessage(message)
            .then(([isCommand, executionTime]) => {
                if(isCommand)
                    Logger(`The previous command has been executed in ${executionTime}ms.`);
            })
            .catch(error => {
                Danger(error);
                let embed = new DiscordJS.RichEmbed()
                .setColor("#C0392B")
                .setTitle("Internal server error")
                .setDescription(error)
                .addField("Informations", "if you are not the owner of this bot, please report this error to the developer(s).")
                .setFooter("See more details in console.")
                .setTimestamp();
                message.channel.send({ embed });
            });
        })

        // Connection the bot
        this.client.login(settings.token);
    }

    private async handleBotReady(){
        // Update bot settings
        Logger("QueenDecim is ready to fire.");

        // Register commands from settings
        if(this.settings.commands && this.settings.commands.length > 0){
            await this.commands.register(this.settings.commands);
            Logger(this.settings.commands.length, "command(s) registered");            
        }

        return true;
    }

    private async handleNewMessage(message: DiscordJS.Message): Promise<[boolean, number]> {
        if(this.commands.isRequestMessage(message.content)){
            // Send loading message
            let loading = <DiscordJS.Message>await message.channel.send("Please wait while i execute the command..."),
                executionTime = new ExecutionTime();

            // Execute the command
            Logger("New command received", message.content);
            let runState = await this.commands.run(message);
            if(!runState) message.reply("the command seems unexistant... try again.");

            // Return the command result
            let stopedAt = executionTime.stop();
            await loading.edit(`Command executed in ${stopedAt}ms.`);
            loading.delete(2500);
            return [true, stopedAt];
        }
        return [false, 0];
    }
}

export { DiscordJS, Core, CommandModel };