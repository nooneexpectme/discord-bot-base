// Imports
import { Events, Client } from '@root/.'
import * as Debug from 'debug'
const log = Debug('qd:handler:ready')

// Method
export async function HandleBotReady(client: Client) {
    // Update bot settings
    log(`%s is ready to fire.`, client.discord.user.username)

    // Register commands from settings
    if (client.settings.commandsAutoRegister && client.settings.commands && client.settings.commands.length > 0) {
        log('%d command(s) found.', client.settings.commands.length)
        await client.registry.register(client.settings.commands)
        if (client.settings.commandsAutoLoad)
            await client.registry.loadRegistry()
    }

    client.dispatcher.emit(Events.CONNECTED)
    return true
}
