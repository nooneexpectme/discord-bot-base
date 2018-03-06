interface QueenDecimSettings {
    token: string,
    avatar?: string,
    game?: string,
    trigger: string,
    version?: string,
    owner?: number,
    owners?: number[],
    commands?: string[],
    commandsAutoRegister?: boolean,
    commandsAutoLoad?: boolean
}

interface CommandRequest {
    command: string,
    arguments: string[]
}

interface CommandEntry {
    name: string,
    description: string,
    instance: any
}

interface CommandSettings {
    trigger: string,
    description: string
}