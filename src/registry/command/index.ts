// Imports
import { Client } from '@root/.'
import { CommandModel } from '@root/model/command'
import { Message } from 'discord.js'

// Debug
import * as Debug from 'debug'
const log = Debug('qd:registry:command')

// Class
export class RegistryCommand {
    private list: {[commandName: string]: CommandModel} = {}
    private client: Client

    public constructor(client: Client) {
        this.client = client
    }

    public register(path: string): RegistryCommand {
        const command: CommandModel = new (require(path))(this.client)

        if (this.list[command.settings.name] !== undefined) {
            log('The command is already registered (%o).', { name: command.settings.name })
            return this
        }

        this.list[command.settings.name] = command
        log('Command registered (%o).', { name: command.settings.name, path })
        return this
    }

    public getRequestFromMessage(message: Message): { command: CommandModel, parameters: any } {
        // Block messages from the bot
        if (!message.content.startsWith(this.client.settings.prefix)) return null

        // Check if it's a valid command
        const prefix = this.client.settings.prefix
        const commandNames = Object.keys(this.list)
        const validatorRegEx = (new RegExp(`^${prefix}(${commandNames.join('|')}) (.+)?`))
        const isDefinedCommand = validatorRegEx.test(message.content)
        if (!isDefinedCommand) return null

        // Retrieve command name + instance
        const [, cmdName, cmdArgs] = message.content.match(validatorRegEx)
        const command = this.list[cmdName]

        // Retrieve parameters
        const parameters = {}
        for (const { name, regEx, type = String } of command.settings.parameters) {
            const [, value] = regEx.exec(message.content)
            parameters[name] = new type(value)
        }

        // Return informations
        return { command, parameters }
    }
}
