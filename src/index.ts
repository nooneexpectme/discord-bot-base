// Register aliases
import { addAliases as ModuleAliases } from 'module-alias'
ModuleAliases({
    '@root': __dirname,
    '@utils': __dirname + '/utils'
})

// Core imports
import { EventEmitter } from 'events'
import { Client as DJSClient, Message, RichEmbed } from 'discord.js'
import Registry from './registry'

// Handlers imports
import { HandleBotError } from './handler/bot-error'
import { HandleBotReady } from './handler/bot-ready'
import { HandleNewMessage } from './handler/new-message'

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
        this.discord.on('ready', () => HandleBotReady(this).catch(error => HandleBotError(this, error)))
        this.discord.on('message', message => {
            HandleNewMessage(this, message)
            .then(isCommand => {
                if (isCommand)
                    log(`The previous command has been executed.`)
            })
            .catch(error => HandleBotError(this, error, message))
        })
        this.discord.on('disconnect', () => this.dispatcher.emit(Events.DISCONNECTED))
    }
}

export { Client }
