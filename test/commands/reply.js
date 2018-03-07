const { CommandModel } = require("../../dist");
class ReplyCommand extends CommandModel {
    constructor(core){
        super(core, {
            trigger: "reply",
            description: "Reply to the user"
        });
    }

    async run(message, args){
        message.reply("replying from REPLY command.");
        return true;
    }
}
module.exports = ReplyCommand;