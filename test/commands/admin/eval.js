const { CommandModel } = require('../../../dist/commands')

class EvalCommand extends CommandModel {
    constructor(client) {
        super(client, {
            name: 'eval',
            description: 'Debug command',
            aliases: [ 'e' ]
        })
    }

    async run(message, args) {
        eval(args)
        message.reply('the script has been executed, check the working console.')
    }
}

module.exports = EvalCommand