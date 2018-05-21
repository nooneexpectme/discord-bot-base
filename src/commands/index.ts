// Imports
import { Client as QueenDecimClient } from '@root/index'
import * as DiscordJS from 'discord.js'

// Debug
import * as debug from 'debug'
const log = debug('qd:commands')

// Commands
import CommandEntry from'./entry'
import CommandModel from './model'

// Exports
export { CommandModel }

// Class
export default class Commands {
    private client: QueenDecimClient
    private commands: CommandEntry[] = []

    constructor(client: QueenDecimClient){ this.client = client }

    // Register
    // TODO: Check for duplications commands name
    private _register(command: any): CommandEntry {
        let entry = new CommandEntry(command, this.client)
        if(!entry.isValidClass) return null
        this.commands.push(entry)
        return entry
    }

    public register(commands: any|any[]): CommandEntry|CommandEntry[] {
        if(!Array.isArray(commands)) commands = [commands]
        let registers = commands.map(command => this._register(command))
        return commands.length === 1 ? registers[0] : registers
    }

    // Global commands (registry)
    public async unregisterAll(): Promise<boolean> {
        let unregisters = await Promise.all(this.commands.map(command => command.unload()))
        for(let i in unregisters)
            if(unregisters[i])
                delete this.commands[i]
        return this.commands.length === 0
    }

    // Global commands (load/unload/reload)
    public async loadRegistry(withoutCaching: boolean = false): Promise<boolean> {
        let loadings = await Promise.all(this.commands.map(command => command.load()))
        return loadings.indexOf(false) === -1
    }
    public async unloadRegistry(): Promise<boolean> {
        let unloadings = await Promise.all(this.commands.map(command => command.unload()))
        return unloadings.indexOf(false) === -1
    }
    public async reloadRegistry(withoutCaching: boolean = false): Promise<boolean> {
        let unloadings = await this.unloadRegistry()
        if(!unloadings) return false
        return await this.loadRegistry(withoutCaching)
    }

    // Access to registry
    public getNames(): string[] { return this.commands.map(command => command.instance.settings.name.trim()) }
    public getByName(name: string): CommandEntry {
        return this.commands
        .find(command => {
            let commandName = command.instance.settings.name
            return commandName.trim().toLowerCase() === name.trim().toLowerCase()
        }) || null
    }

    // Message validator
    public isRequestMessage(content: string): boolean { return content.startsWith(this.client.settings.prefix, 0) }
    public getRequestInformations(content: string): CommandRequest {
        let request = { command: null, parameters: {}, isValid: false }
        // Check it's a valid request
        content = content.replace(this.client.settings.prefix, "").trim()
        if(!content.length) return request

        // Retrieve the called command and check the command exists
        request.command = this.getByName(content.split(" ")[0] || content)
        let cmdInstance: CommandModel = request.command.instance
        if(request.command === null) return request
        
        // Check parameters
        content = content.replace(cmdInstance.settings.name.trim().toLowerCase(), "").trim()
        for(let parameter of cmdInstance.settings.parameters){
            let execution = parameter.value.exec(content),
                value = execution !== null ? execution.pop() : null
            request.parameters[parameter.name] = parameter.type ? parameter.type(value) : value
        }
        request.isValid = true
        return request
    }

    // Execute query
    public async run(message: DiscordJS.Message): Promise<boolean> {
        let request = this.getRequestInformations(message.content)
        if(!request.isValid) return false
        await request.command.instance.run(message, request.parameters)
        return true
    }
}