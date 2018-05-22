// Register aliases
import { addAliases as ModuleAliases } from 'module-alias'
ModuleAliases({
    '@root': __dirname,
    '@utils': __dirname + '/utils'
})

// Imports
import { EventEmitter } from 'events'
import { Client as DJSClient, Message, RichEmbed } from 'discord.js'
import Registry from './registry'

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
        this.client.on('ready', () => this.handleBotReady().catch(this.handleBotError.bind(this)))
        this.client.on('message', message => {
            this.handleNewMessage(message)
            .then(isCommand => {
                if (isCommand)
                    log(`The previous command has been executed.`)
            })
            .catch(error => this.handleBotError(error, message))
        })
        this.client.on('disconnect', () => this.dispatcher.emit(Events.DISCONNECTED))
    }

    private async handleBotError(error: any, message?: Message) {
        log('An error has occured.')
        this.dispatcher.emit(Events.ERROR, error)

        // Throw error in PM
        if (this.settings.throwErrorPM === false) return false
        const embed = new RichEmbed()
        .setColor('#C0392B')
        .setFooter('See more details in console.')
        .setTimestamp()

        if (this.settings.ownerId) {
            // Throw in PM
            embed
            .setTitle('Internal server error')
            .setDescription(error)
            await Promise.all([
                this.client.users.get(this.settings.ownerId).send({ embed }),
                message.channel.send('Thanks you, we just found a new error.')
            ])
        } else {
            // Warning in the server
            log('Please, set-up the OWNER option or disable throwErrorPM.')
            embed.addField('Warning', 'If you are the owner of this bot, please set-up the `owner` option with your ID, if it\'s not you, please alert him.')
            embed.addField('Error reported', 'The error has been reported in the console.')
            await message.channel.send({ embed })
        }
    }

    private async handleBotReady() {
        // Update bot settings
        log(`%s is ready to fire.`, this.client.user.username)

        // Register commands from settings
        if (this.settings.commandsAutoRegister && this.settings.commands && this.settings.commands.length > 0) {
            log('%d command(s) found.', this.settings.commands.length)
            await this.registry.register(this.settings.commands)
            if (this.settings.commandsAutoLoad)
                await this.registry.loadRegistry()
        }

        this.dispatcher.emit(Events.CONNECTED)
        return true
    }

    private async handleNewMessage(message: Message): Promise<boolean> {
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
}

export { Client }
