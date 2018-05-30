// Import
import { Message, RichEmbed } from 'discord.js'
import { CommandRequest } from '@model/CommandRequest'

// Debug
import * as Debug from 'debug'
const log = Debug('qd:embed:notEnoughArgs')

// Export
export function notEnoughArgsEmbed(prefix: string, message: Message, request: CommandRequest): RichEmbed {
    log('Not enough args passed to the request (%o).', {
        request: message.content,
        need: request.command.settings.args.map(a => a.name) || []
    })

    return new RichEmbed()
        .setTitle('Not enough args passed to the command.')
        .setColor('#EB9532')
        .addField('Expected', '`' + prefix + request.command.settings.name + ' ' + request.command.settings.args.map(a => `<${a.name}>`).join(' ') + '`')
        .addField('Actual', '`' + message.content + '`')
        .setFooter(message.author.username + '#' + message.author.discriminator)
        .setTimestamp()
}
