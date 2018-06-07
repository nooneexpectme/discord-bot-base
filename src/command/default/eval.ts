// Imports
import { CommandBase } from '../../model/CommandBase'
import { Client } from '../../'
import { Message } from 'discord.js'

// Command
module.exports = class EvalCommand extends CommandBase {
    constructor(client: Client) {
        super(client, {
            group: 'default',
            name: 'eval',
            description: 'Evaluate a chunk of code',
            ownerOnly: true
        })
    }

    public async run(msg: Message, { requestContent }): Promise<void> {
        /* tslint:disable:no-eval */
        const execution = eval(requestContent)
        if (execution) await msg.channel.send(execution)
        /* tslint:enable:no-eval */
    }
}
