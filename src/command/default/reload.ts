// Import
import { CommandBase } from '../../model/CommandBase'
import { Client } from '../../'
import { Message, RichEmbed } from 'discord.js'

// Command
module.exports = class ReloadCommand extends CommandBase {
    constructor(client: Client) {
        super(client, {
            group: 'default',
            name: 'reload',
            description: 'Reload a command.',
            args: [
                {
                    name: 'command',
                    type: String,
                    validator: command => {
                        if (!this.client.registry.command.getPathFromName(command))
                            return [false, 'You are asking for an unregistered command, type `!help` to see command list.']
                        return [true, null]
                    }
                }
            ]
        })
    }

    public async run(msg: Message, { command }): Promise<void> {
        const path = this.client.registry.command.getPathFromName(command)
        await this.client.registry.command.unregister(path)
        delete require.cache[require.resolve(path)]
        await this.client.registry.command.register(path)
        await msg.react('✅')
    }
}
