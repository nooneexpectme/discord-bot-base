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
    await message.channel.send(JSON.stringify(request))
    return true
    /*
    // Send loading message
    const loading = <Message> await message.channel.send('Please wait while i execute the command...')

    // Execute the command
    log('New command received (%o).', { content: message.content })
    const state = await client.registry.run(message)
    .catch(error => {
        loading.delete()
        throw new Error(error)
    })
    if (!state) message.reply('the command seems unexistant... try again.')

    // Return the command result
    await loading.edit(`Command executed.`)
    loading.delete(2500)
    return true
    */
}
