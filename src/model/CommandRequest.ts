import { CommandBase } from '@model/CommandBase'

export enum CommandRequestError {
    NOT_ENOUGH_ARGS = 'NotEnoughArgs',
    UNDEFINED_COMMAND = 'UndefinedCommand'
}

export class CommandRequest {
    public commandName: string
    public command: CommandBase
    public args: {[key: string]: any} = {}
    public error: CommandRequestError = null
}
