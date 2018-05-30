import { Message } from 'discord.js'
import { Client } from '@root/index'

export class CommandBase {
    public settings: CommandSettings
    private client: Client

    constructor(client: Client, settings: CommandSettings) {
        this.client = client
        this.settings = settings
    }

    public async load(): Promise<void> {
        return
    }

    public async unload(): Promise<void> {
        return
    }

    public async run(message: Message, args: any): Promise<void> {
        message.reply('Default command initialized, please set-up the run function.')
    }
}
