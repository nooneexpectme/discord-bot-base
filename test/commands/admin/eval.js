const { CommandBase } = require('../../../dist/model/CommandBase')

class EvalCommand extends CommandBase {
    constructor(client) {
        super(client, {
            name: 'eval',
            description: 'Debug command',
            aliases: [ 'e' ]
        })
    }

    async run(message, { requestContent }) {
        eval(requestContent)
        message.reply('the script has been executed, check the working console.')
    }
}

module.exports = EvalCommand