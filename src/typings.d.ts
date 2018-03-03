interface QueenDecimSettings {
    token: string,
    avatar?: string,
    game?: string,
    trigger: string,
    version?: string,
    owner?: number,
    owners?: number[],
    commands?: any[]
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

interface CommandBaseInformations {
    command: string,
    description?: string,
    owner?: string,
    created?: string
}