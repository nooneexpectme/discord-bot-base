import { Client as QueenDecimClient } from "@root/index";
import { exists } from "async-file";
import CommandModel from "./model";

export default class CommandEntry {
    private _class: any;
    private _isLoaded: boolean;
    private _instance: CommandModel;
    private _client: QueenDecimClient;

    constructor(command: () => void, core: QueenDecimClient){
        this._class = command;
        this._client = core;
    }

    public get isLoaded(): boolean { return this._isLoaded; }
    public get instance(): CommandModel { return this._instance; }
    public get isValidClass(): boolean { return (new this._class()) instanceof CommandModel; };

    public async load(): Promise<boolean> {
        if(!this.isValidClass) return false;
        this._instance = new this._class(this._client);
        this._isLoaded = await this.instance.load();
        return this.isLoaded;
    }
    
    public async unload(): Promise<boolean> {
        if(!this._isLoaded) return false;        
        this._isLoaded = await this.instance.unload();
        return this.isLoaded;
    }

    public async reload(): Promise<boolean> {
        if(!this._isLoaded) return false;
        if(!(await this.unload())) return false;
        return await this.load();
    }
}