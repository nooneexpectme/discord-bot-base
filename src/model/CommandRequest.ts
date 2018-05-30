import { CommandBase } from '@model/CommandBase'

export enum CommandRequestError {
    NOT_ENOUGH_ARGS = 'NotEnoughArgs',
    UNDEFINED_COMMAND = 'UndefinedCommand',
    INVALID_ARG = 'InvalidArg'
}

export class CommandRequest {
    public command: CommandBase
    public args: {[key: string]: any} = {}
    public error: CommandRequestError = null
    public validatorError?: string
}
