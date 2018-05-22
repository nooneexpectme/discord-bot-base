import { Client } from '@root/.'
import { CommandModel } from '@root/model/command'

export default class CommandEntry {
    private class: any
    private isLoaded: boolean
    private instance: CommandModel
    private client: Client

    constructor(command: () => void, client: Client) {
        this.client = client
        this.class = command
    }

    public get isValidClass(): boolean { return (new this.class()) instanceof CommandModel }

    public async load(): Promise<boolean> {
        if (!this.isValidClass) return false
        this.instance = new this.class(this.client)
        this.isLoaded = await this.instance.load()
        return this.isLoaded
    }

    public async unload(): Promise<boolean> {
        if (!this.isLoaded) return false
        this.isLoaded = await this.instance.unload()
        return this.isLoaded
    }

    public async reload(): Promise<boolean> {
        if (!this.isLoaded) return false
        if (!(await this.unload())) return false
        return await this.load()
    }
}
