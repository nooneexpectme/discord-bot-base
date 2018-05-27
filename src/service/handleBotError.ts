// Imports
import { Message, RichEmbed } from 'discord.js'
import { Client, Events } from '@root/.'
import * as Debug from 'debug'
const log = Debug('qd:handler:error')

// Method
export async function handleBotError(client: Client, error: any, message?: Message) {
    log('An error has occured.')
    client.dispatcher.emit(Events.ERROR, error)

    // Throw error in PM
    if (client.settings.throwErrorPM === false) return false
    const embed = new RichEmbed()
    .setColor('#C0392B')
    .setFooter('See more details in console.')
    .setTimestamp()

    if (client.settings.ownerId) {
        // Throw in PM
        embed
        .setTitle('Internal server error')
        .setDescription(error)
        await Promise.all([
            client.discord.users.get(client.settings.ownerId).send({ embed }),
            message.channel.send('Thanks you, we just found a new error.')
        ])
    } else {
        // Warning in the server
        log('Please, set-up the OWNER option or disable throwErrorPM.')
        embed.addField('Warning', 'If you are the owner of client bot, please set-up the `owner` option with your ID, if it\'s not you, please alert him.')
        embed.addField('Error reported', 'The error has been reported in the console.')
        await message.channel.send({ embed })
    }
}
