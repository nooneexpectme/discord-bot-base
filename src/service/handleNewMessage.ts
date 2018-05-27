// Imports
import { Client } from '@root/index'
import { Message } from 'discord.js'
import { getRequestFromMessage } from '@service/getRequestFromMessage'
import { CommandRequestError } from '@model/CommandRequest'

// Debug
import * as Debug from 'debug'
const log = Debug('qd:handler:message')

// Method
export async function handleNewMessage(client: Client, message: Message): Promise<boolean> {
    // Ignore messages from the bot
    if (message.author.id === client.discord.user.id) return false

    // Do the job
    const request = getRequestFromMessage(client, message)

    if (request.error !== CommandRequestError.NO_ERROR) {
        log('Error: %s.', request.error)
        return false
    }

    await request.command.run(message, request.parameters)
    return true
}
