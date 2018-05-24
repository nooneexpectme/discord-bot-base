// Imports
// Imports
import { Client } from '@root/.'

// Registry managers
import { RegistryGroup } from './group'
import { RegistryCommand } from './command'

// Class
export default class Registry {
    public group: RegistryCommand = new RegistryGroup()
    public command: RegistryCommand = new RegistryCommand()
    private client: Client

    public constructor(client: Client) {
        this.client = client
    }

}
