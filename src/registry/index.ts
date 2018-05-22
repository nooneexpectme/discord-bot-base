// Imports
import { Client } from '@root/.'
import { Message } from 'discord.js'

import Command from './command'
import { CommandModel } from '@root/model/command'

// Events
const Events = {
    COMMAND_LOAD: 'CommandLoad',
    COMMAND_LOADED: 'CommandLoaded',
    COMMAND_UNLOAD: 'CommandUnload',
    COMMAND_UNLOADED: 'CommandUnloaded',
    REGISTRY_RELOAD: 'RegistryReload',
    REGISTRY_RELOADED: 'RegistryReloaded'
}
export { Events }

// Class
export default class Registry {
    public commands: any[] = []
    private client: Client

    public constructor(client: Client) {
        this.client = client
    }

    public register(commands: any|any[]): CommandEntry|CommandEntry[] {
        if (!Array.isArray(commands)) commands = [commands]
        const registers = commands.map(command => this._register(command))
        return commands.length === 1 ? registers[0] : registers
    }

    // Global commands (registry)
    public async unregisterAll(): Promise<boolean> {
        const unregisters = await Promise.all(this.commands.map(command => command.unload()))
        for (const i in unregisters)
            if (unregisters[i])
                delete this.commands[i]
        return this.commands.length === 0
    }

    // Global commands (load/unload/reload)
    public async loadRegistry(withoutCaching: boolean = false): Promise<boolean> {
        const loadings = await Promise.all(this.commands.map(command => command.load()))
        return loadings.indexOf(false) === -1
    }

    public async unloadRegistry(): Promise<boolean> {
        const unloadings = await Promise.all(this.commands.map(command => command.unload()))
        return unloadings.indexOf(false) === -1
    }

    public async reloadRegistry(withoutCaching: boolean = false): Promise<boolean> {
        const unloadings = await this.unloadRegistry()
        if (!unloadings) return false
        return await this.loadRegistry(withoutCaching)
    }

    // Access to registry
    public getNames(): string[] { return this.commands.map(command => command.instance.settings.name.trim()) }

    public getByName(name: string): CommandEntry {
        return this.commands
        .find(command => {
            const commandName = command.instance.settings.name
            return commandName.trim().toLowerCase() === name.trim().toLowerCase()
        }) || null
    }

    // Message validator
    public isRequestMessage(content: string): boolean { return content.startsWith(this.client.settings.prefix, 0) }

    public getRequestInformations(content: string): CommandRequest {
        const request = { command: null, parameters: {}, isValid: false }
        // Check it's a valid request
        content = content.replace(this.client.settings.prefix, '').trim()
        if (!content.length) return request

        // Retrieve the called command and check the command exists
        request.command = this.getByName(content.split(' ')[0] || content)
        const cmdInstance: CommandModel = request.command.instance
        if (request.command === null) return request

        // Check parameters
        content = content.replace(cmdInstance.settings.name.trim().toLowerCase(), '').trim()
        for (const parameter of cmdInstance.settings.parameters) {
            const execution = parameter.value.exec(content)
            const value = execution !== null ? execution.pop() : null
            request.parameters[parameter.name] = parameter.type ? parameter.type(value) : value
        }
        request.isValid = true
        return request
    }

    // Execute query
    public async run(message: Message): Promise<boolean> {
        const request = this.getRequestInformations(message.content)
        if (!request.isValid) return false
        await request.command.instance.run(message, request.parameters)
        return true
    }

    // TODO: Check for duplications commands name
    private _register(command: any): Command {
        const entry = new Command(command, this.client)
        if (!entry.isValidClass) return null
        this.commands.push(entry)
        return entry
    }
}
