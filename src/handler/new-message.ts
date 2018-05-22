// Imports
import { Message } from 'discord.js'
import { Client } from '@root/.'
import * as Debug from 'debug'
const log = Debug('qd:handler:message')

// Method
export async function HandleNewMessage(message: Message): Promise<boolean> {
    if (!this.registry.isRequestMessage(message.content)) return false

    // Send loading message
    const loading = <Message> await message.channel.send('Please wait while i execute the command...')

    // Execute the command
    log('New command received (%o).', { content: message.content })
    const state = await this.registry.run(message)
    .catch(error => {
        loading.delete()
        throw new Error(error)
    })
    if (!state) message.reply('the command seems unexistant... try again.')

    // Return the command result
    await loading.edit(`Command executed.`)
    loading.delete(2500)
    return true
}
