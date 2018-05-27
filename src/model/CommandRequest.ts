import { CommandBase } from '@model/CommandBase'

export enum CommandRequestError {
    NO_ERROR = 'NoError',
    NOT_A_COMMAND = 'NotACommandRequest',
    NOT_ENOUGH_ARGS = 'NotEnoughArgs',
    UNDEFINED_COMMAND = 'UndefinedCommand'
}

export class CommandRequest {
    public command: CommandBase
    public args: {[key: string]: any} = {}
    public error: CommandRequestError = CommandRequestError.NO_ERROR
}
