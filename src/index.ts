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
    public client: DJSClient = new DJSClient()
    public registry: Registry

    constructor(settings: QueenDecimSettings) {
        this.settings = settings
        this.registry = new Registry(this)
        this.listenEvents()
    }

    public logIn(): Promise<string> { return this.client.login(this.settings.token) }
    public logOut(): Promise<void> { return this.client.destroy() }

    private listenEvents(): void {
        log('Listen events.')
        this.client.on('ready', () => HandleBotReady(this).catch(HandleBotError.bind(this)))
        this.client.on('message', message => {
            HandleNewMessage(message)
            .then(isCommand => {
                if (isCommand)
                    log(`The previous command has been executed.`)
            })
            .catch(error => HandleBotError(error, message))
        })
        this.client.on('disconnect', () => this.dispatcher.emit(Events.DISCONNECTED))
    }
}

export { Client }
