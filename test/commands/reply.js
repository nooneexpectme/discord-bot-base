const { CommandModel } = require("../../dist");
class ReplyCommand extends CommandModel {
    constructor(client){
        super(client, {
            name: "reply",
            description: "Reply to the user"
        });
    }

    async run(message, args){
        message.reply("replying from REPLY command.");
        return true;
    }
}
module.exports = ReplyCommand;