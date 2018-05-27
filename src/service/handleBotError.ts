// Imports
import { Message, RichEmbed } from 'discord.js'
import { Client, Events } from '@root/index'
import { internalServerErrorEmbed } from '@embed/internalServerError'
import { missingOwnerIdEmbed } from '@embed/missingOwnerId'

// Debug
import * as Debug from 'debug'
const log = Debug('qd:handler:error')

// Method
export async function handleBotError(client: Client, error: any, message?: Message): Promise<void> {
    log('An error has occured.')
    client.dispatcher.emit(Events.ERROR, error)
    message.reply('sorry, i can\'t run you\'re command.')

    // Throw error in PM
    if (client.settings.throwErrorPM !== false) {
        if (!client.settings.ownerId) message.channel.send({ embed: missingOwnerIdEmbed() })
        else {
            client.discord.users
                .get(client.settings.ownerId)
                .send({ embed: internalServerErrorEmbed(error) })
        }
    }
}
