interface QueenDecimSettings {
    token: string
    prefix: string
    ownerId?: string
    throwErrorPM?: boolean
}

interface CommandSettings {
    name: string
    description: string
    parameters?: CommandSettingsParameter[]
    aliases?: string[]
}

interface CommandSettingsParameter {
    name: string
    regEx: RegExp
    type?: any
}