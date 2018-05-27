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
        // Required information for regular expressions
        const prefix = this.client.settings.prefix
        const commandNames = Object.keys(this.list)

        // Init regular expressions
        // Thanks to https://github.com/Shinobu1337/discord-command-parser/blob/master/src/regexps.js
        const validatorRegEx = (new RegExp(`^${prefix}(${commandNames.join('|')}) (.+)?`))
        const argsRegEx = new RegExp(/"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|```((.|\s)*?)```|\S+/g)
        const quoteStripRegEx = new RegExp(/^"|"$|^'|'$|^```(\S*\n?)|```$/g)

        // Check if it's a registered command
        const isRegisteredCommand = validatorRegEx.test(message.content)
        if (!isRegisteredCommand) return null

        // Retrieve command name, args, instance
        const [, cmdName, cmdArgs] = message.content.match(validatorRegEx)
        const cmdInstance = this.list[cmdName]
        const args = cmdArgs.match(argsRegEx).map(v => v.replace(quoteStripRegEx, ''))
        if (cmdInstance.settings.parameters.length > args.length) return null
        const parameters = []

        for (let i = 0; i < cmdInstance.settings.parameters.length; i++) {
            const parameter = cmdInstance.settings.parameters[i]
            parameters[parameter.name] = new parameter.type(args[i])
        }

        // Return informations
        return { command: cmdInstance, parameters }
    }
}
