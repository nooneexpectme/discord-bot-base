// Imports
import { Client } from '@root/index'
import { CommandBase } from '@model/CommandBase'

// Debug
import * as Debug from 'debug'
const log = Debug('qd:registry:command')

// Class
export class RegistryCommand {
    private list: {[commandName: string]: CommandBase} = {}
    private client: Client

    public constructor(client: Client) {
        this.client = client
    }

    public exists(name: string) {
        return this.list[name] !== undefined
    }

    public get(name: string): CommandBase {
        return this.exists(name) ? this.list[name] : null
    }

    public getNames(): string[] {
        return Object.keys(this.list)
    }

    public register(path: string): RegistryCommand {
        const command: CommandBase = new (require(path))(this.client)

        if (this.list[command.settings.name] !== undefined) {
            log('The command is already registered (%o).', { name: command.settings.name })
            return this
        }

        this.list[command.settings.name] = command
        log('Command registered (%o).', { group: command.settings.group || null, name: command.settings.name })
        return this
    }
}
