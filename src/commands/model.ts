import { Core as QueenDecimCore, DiscordJS } from "@root/index";

export default class CommandModel {
    private core: QueenDecimCore;
    public settings: CommandSettings;

    constructor(core: QueenDecimCore, settings: CommandSettings){
        this.core = core;
        this.settings = settings;
    };

    async load(): Promise<boolean> { return true; }
    async unload(): Promise<boolean> { return true; }

    async run(message: DiscordJS.Message, args: any[]): Promise<boolean> {
        message.reply("Default command initialized, please set-up the run function.");
        return true;
    };
}