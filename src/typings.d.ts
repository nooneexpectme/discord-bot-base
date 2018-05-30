interface QueenDecimSettings {
    token: string
    prefix: string
    ownerId?: string
    throwErrorPM?: boolean
    throwErrorChannel?: boolean
}

interface CommandSettings {
    name: string
    group: string
    description: string
    details?: string
    args?: CommandSettingsParameter[]
    aliases?: string[]
}

interface CommandSettingsParameter {
    name: string
    type?: any,
    validator?: (arg) => [boolean, string]
}