// Register aliases
import { addAliases as ModuleAliases } from 'module-alias'
ModuleAliases({
    '@root': __dirname,
    '@service': __dirname + '/service',
    '@model': __dirname + '/model',
    '@embed': __dirname + '/embed'
})

// Core imports
import { EventEmitter } from 'events'
import { Client as DJSClient, Message } from 'discord.js'
import Registry from '@root/registry'

// Handlers imports
import { handleBotError } from '@service/handleBotError'
import { handleBotReady } from '@service/handleBotReady'
import { handleNewMessage } from '@service/handleNewMessage'

// Debug
import * as debug from 'debug'
const log = debug('qd:main')

// Events
const Events = {
    CONNECTED: 'ServerConnected',
    ERROR: 'ServerError',
    DISCONNECTED: 'ServerDisconnected'
}
export { Events }

// Client
class Client {
    public dispatcher: EventEmitter = new EventEmitter()
    public settings: QueenDecimSettings
    public discord: DJSClient = new DJSClient()
    public registry: Registry

    constructor(settings: QueenDecimSettings) {
        this.settings = settings
        this.registry = new Registry(this)
        this.listenEvents()
    }

    public logIn(): Promise<string> { return this.discord.login(this.settings.token) }
    public logOut(): Promise<void> { return this.discord.destroy() }

    private listenEvents(): void {
        log('Listen events.')
        this.discord.on('ready', () => handleBotReady(this).catch(error => handleBotError(this, error)))
        this.discord.on('message', message => {
            handleNewMessage(this, message)
            .then(isCommand => {
                if (isCommand)
                    log(`The previous command has been executed.`)
            })
            .catch(error => handleBotError(this, error, message))
        })
        this.discord.on('disconnect', () => this.dispatcher.emit(Events.DISCONNECTED))
    }
}

export { Client }
