// Imports
import { Client } from '@root/.'
import { Message } from 'discord.js'

// Debug
import * as Debug from 'debug'
const log = Debug('qd:handler:message')

// Method
export async function HandleNewMessage(client: Client, message: Message): Promise<boolean> {
    // Ignore messages from the bot
    if (message.author.id === client.discord.user.id) return false

    // Do the job
    const request = client.registry.command.getRequestFromMessage(message)
    await request.command.run(message, request.parameters)
    return true
}
