interface QueenDecimSettings {
    token: string,
    prefix: string,
    ownerId?: string,
    throwErrorPM?: boolean
}

interface CommandRequest {
    command: CommandEntry,
    parameters: {[name: string]: string},
    isValid: boolean
}

interface CommandEntry {
    name: string,
    description: string,
    instance: any
}

interface CommandSettings {
    name: string,
    description: string,
    parameter?: CommandSettingsParameter,
    parameters?: CommandSettingsParameter[],
    aliases?: string[]
}

interface CommandSettingsParameter {
    name: string,
    value: RegExp,
    type?: any
}