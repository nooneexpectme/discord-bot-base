// Import
import { RichEmbed } from 'discord.js'
import { CommandRequest } from '@model/CommandRequest'

// Debug
import * as Debug from 'debug'
const log = Debug('qd:embed:undefinedCommand')

// Embed
export function undefinedCommandEmbed(request: CommandRequest): RichEmbed {
    log('Trying to run an unexistant command (%o).', { command: request.commandName })
    return new RichEmbed()
        .setTitle('Trying to run an unexistant command')
        .setDescription('The command you tried to run does not exists, type `!help` to see the command list.')
}
