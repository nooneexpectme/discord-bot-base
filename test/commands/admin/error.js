const { CommandBase } = require('../../../dist/model/CommandBase')

class ErrorCommand extends CommandBase {
    constructor(client){
        super(client, {
            name: 'error',
            description: 'throw an custom error',
            aliases: ['err']
        })
    }

    async run(message, args){
        throw new Error(...args)
        message.reply('Error throwed.')
        return true
    }
}

module.exports = ErrorCommand
