const { CommandModel } = require("../../dist");
class ReloadCommand extends CommandModel {
    constructor(client){
        super(client, {
            name: "reload",
            description: "Reload commands"
        });
        this.client = client;
    }

    async run(message, args){
        this.client.commands.reloadRegistry(true);
        await message.reply("Reloaded");
        return true;
    }
}
module.exports = ReloadCommand;