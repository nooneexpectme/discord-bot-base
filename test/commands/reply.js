const { CommandModel } = require("../../dist");
class ReplyCommand extends CommandModel {
    constructor(client){
        super(client, {
            name: "reply",
            description: "Reply to the user",
            parameters: [
                { name: "text", value: new RegExp(/"(.+)"/, "g"), type: String },
                { name: "nbr", value: new RegExp(/([0-9]+)/, "g"), type: Number },
                { name: "display", value: new RegExp(/(true|false|0|1)/, "g"), type: Boolean }
            ],
            aliases: ["r"]
        });
    }

    async run(message, args){
        console.log("reply", args);
        message.reply("replying from REPLY command.");
        return true;
    }
}
module.exports = ReplyCommand;