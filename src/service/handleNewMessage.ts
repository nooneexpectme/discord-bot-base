// Imports
import { Client } from '@root/index'
import { Message } from 'discord.js'
import { queryParser } from '@service/queryParser'
import { CommandRequestError } from '@model/CommandRequest'

// Embeds
import { notEnoughArgsEmbed } from '@embed/notEnoughArgs'
import { undefinedCommandEmbed } from '@embed/undefinedCommand'

// Debug
import * as Debug from 'debug'
const log = Debug('qd:handler:message')

// Method
export async function handleNewMessage(client: Client, message: Message): Promise<boolean> {
    // Ignore normal messages
    if (!message.content.startsWith(client.settings.prefix)) return false

    // Do the job
    const request = queryParser(client, message)
    log('Command request (%o).', { request: message.content })

    // Error: UndefinedCommand
    if (request.error === CommandRequestError.UNDEFINED_COMMAND) {
        await message.channel.send({ embed: undefinedCommandEmbed(request) })
        return false
    }

    // Error: NotEnoughArgs
    if (request.error === CommandRequestError.NOT_ENOUGH_ARGS) {
        await message.channel.send({ embed: notEnoughArgsEmbed(client.settings.prefix, message, request) })
        return false
    }

    // Everything is right, run the command
    await request.command.run(message, request.args)
    return true
}
