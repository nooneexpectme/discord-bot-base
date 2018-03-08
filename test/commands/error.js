const { CommandModel } = require("../../dist");
class ErrorCommand extends CommandModel {
    constructor(client){
        super(client, {
            name: "error",
            description: "throw an custom error"
        });
    }

    async run(message, args){
        throw new Error(...args);
        message.reply("Error throwed.");
        return true;
    }
}
module.exports = ErrorCommand;