// Imports
import { CommandBase } from '@model/CommandBase'
import { Client } from '@root/index'
import { Message } from 'discord.js'

// Command
module.exports = class EvalCommand extends CommandBase {
    constructor(client: Client) {
        super(client, {
            group: 'default',
            name: 'eval',
            description: 'Evaluate a chunk of code'
        })
    }

    public async run(msg: Message, { requestContent }): Promise<void> {
        /* tslint:disable:no-eval */
        eval(requestContent)
        /* tslint:enable:no-eval */
    }
}
