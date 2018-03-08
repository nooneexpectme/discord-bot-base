import { Client as QueenDecimClient } from "@root/index";
import { exists } from "async-file";
import CommandModel from "./model";

export default class CommandEntry {
    private _path: string;
    private _isLoaded: boolean;
    private _instance: CommandModel;
    private _client: QueenDecimClient;

    constructor(path: string, core: QueenDecimClient){
        this._path = path;
        this._client = core;
    }

    public get path(): string { return this._path; }
    public get isLoaded(): boolean { return this._isLoaded; }
    public get instance(): CommandModel { return this._instance; }

    public async isValidPath(): Promise<boolean> { return await exists(this._path); }

    // TODO: Create new instance of command
    public async load(): Promise<boolean> {
        if(!(await this.isValidPath())) return false;
        this._instance = new (require(this._path))(this._client);
        this._isLoaded = await this.instance.load();
        return this.isLoaded;
    }
    
    public async unload(): Promise<boolean> {
        if(!this._isLoaded) return false;        
        this._isLoaded = await this.instance.unload();
        return this.isLoaded;
    }

    // TODO: Set hot-reload on parameters (default: true), clear require cache
    public async reload(): Promise<boolean> {
        if(!this._isLoaded) return false;
        if(!(await this.unload())) return false;
        return await this.load();
    }
}