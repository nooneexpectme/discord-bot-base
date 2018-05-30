// Import
import { CommandBase } from '@model/CommandBase'
import { Client } from '@root/index'
import { Message, RichEmbed } from 'discord.js'

// Command
module.exports = class HelpCommand extends CommandBase {
    constructor(client: Client) {
        super(client, {
            group: 'default',
            name: 'help',
            description: 'List of available commands and useful things.'
        })
    }

    public async run(msg: Message): Promise<void> {
        await msg.author.send({
            embed: new RichEmbed()
                .addField('test', 'test')
        })
    }
}
