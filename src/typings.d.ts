interface QueenDecimSettings {
    token: string
    prefix: string
    ownerId?: string
    throwErrorPM?: boolean
    throwErrorChannel?: boolean
}

interface CommandSettings {
    name: string
    description: string
    args?: CommandSettingsParameter[]
    aliases?: string[]
}

interface CommandSettingsParameter {
    name: string
    type?: any
}