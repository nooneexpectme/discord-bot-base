// Imports
import { Events, Client } from '@root/.'
import * as Debug from 'debug'
const log = Debug('qd:handler:ready')

// Method
export async function HandleBotReady(client: Client) {
    log(`%s is ready to fire.`, client.discord.user.username)
    client.dispatcher.emit(Events.CONNECTED)
    return true
}
