// Imports
import { Events, Client } from '@root/.'
import * as Debug from 'debug'
const log = Debug('qd:handler:ready')

// Method
export async function HandleBotReady(main: Client) {
    // Update bot settings
    log(`%s is ready to fire.`, main.client.user.username)

    // Register commands from settings
    if (main.settings.commandsAutoRegister && main.settings.commands && main.settings.commands.length > 0) {
        log('%d command(s) found.', main.settings.commands.length)
        await main.registry.register(main.settings.commands)
        if (main.settings.commandsAutoLoad)
            await main.registry.loadRegistry()
    }

    main.dispatcher.emit(Events.CONNECTED)
    return true
}
