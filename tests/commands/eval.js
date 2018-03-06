const { CommandModel } = require("../../dist");
class EvalCommand extends CommandModel {
    constructor(core){
        super(core, {
            trigger: "eval",
            description: "Debug command"
        })
    }

    async run(message, args){
        eval(args.join(""));
        message.reply("the script has been executed, check the working console.");
    }
}
module.exports = EvalCommand;