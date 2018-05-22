import { Message } from 'discord.js'
import { Client } from '@root/.'

export class CommandModel {
    public settings: CommandSettings
    private client: Client

    constructor(client: Client, settings: CommandSettings) {
        this.client = client
        this.settings = settings
    }

    public async load(): Promise<boolean> {
        return true
    }

    public async unload(): Promise<boolean> {
        return true
    }

    public async run(message: Message, args: any[]): Promise<boolean> {
        message.reply('Default command initialized, please set-up the run function.')
        return true
    }
}
