import { Client as QueenDecimClient, DiscordJS } from "@root/index";

export default class CommandModel {
    private client: QueenDecimClient;
    public settings: CommandSettings;

    constructor(client: QueenDecimClient, settings: CommandSettings){
        this.client = client;
        this.settings = settings;
    };

    async load(): Promise<boolean> { return true; }
    async unload(): Promise<boolean> { return true; }

    async run(message: DiscordJS.Message, args: any[]): Promise<boolean> {
        message.reply("Default command initialized, please set-up the run function.");
        return true;
    };
}