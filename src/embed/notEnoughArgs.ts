// Imports
import { Message, RichEmbed } from 'discord.js'
import { CommandRequest } from '../model/CommandRequest'
import * as Debug from 'debug'
const log = Debug('qd:embed:notEnoughArgs')

// Export
export function notEnoughArgsEmbed(prefix: string, message: Message, request: CommandRequest): RichEmbed {
    log('Not enough args passed to the request (%o).', {
        request: message.content,
        need: request.command.settings.args.map(a => a.name) || []
    })

    const expected = '`' + prefix + request.command.settings.name + ' ' + request.command.settings.args.map(a => `<${a.name}>`).join(' ') + '`'
    const actual = '`' + message.content + '`'

    return new RichEmbed()
        .setColor('#EB9532')
        .setTitle('Not enough args passed to the command.')
        .setDescription('The command expects the format `' + expected + '` and you are asking for `' + actual + '`.')
        .setFooter(message.author.username + '#' + message.author.discriminator)
        .setTimestamp()
}
