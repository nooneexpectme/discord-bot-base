const { CommandBase } = require('../../../dist/model/CommandBase')

class ReplyCommand extends CommandBase {
    constructor(client){
        super(client, {
            name: 'reply',
            description: 'Reply to the user',
            args: [
                { name: 'text', type: String },
                { name: 'nbr', type: Number },
                { name: 'display', type: Boolean }
            ],
            aliases: [ 'r' ]
        })
    }

    async run(message, { text, nbr, display }){
        console.log(`Reply "${text}" ${nbr} times (display: ${display ? 'true': 'false'}).`)
        if (!display) return
        const replies = []
        for (let i = 0; i < nbr; i++) {
            replies.push(message.reply(text.toString()))
        }
        return await Promise.all(replies)
    }
}

module.exports = ReplyCommand