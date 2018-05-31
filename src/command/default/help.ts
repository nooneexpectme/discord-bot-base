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
        // Build the RichEmbed
        const helpEmbed = new RichEmbed()
            .addField('commands', this.client.registry.command.getNames())

        // Send & delete
        const promises = [ msg.author.send({ embed: helpEmbed }) ]
        if (msg.deletable) promises.push(msg.delete())
        await Promise.all(promises)
    }
}
