// Imports
import { Client } from '../'
import { RegistryGroup } from './group'
import { RegistryCommand } from './command'

// Class
export default class Registry {
    public group: RegistryGroup = new RegistryGroup()
    public command: RegistryCommand
    private client: Client

    public constructor(client: Client) {
        this.client = client
        this.command = new RegistryCommand(client)
    }
}
