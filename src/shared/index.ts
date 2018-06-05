export default class Shared {
    private objects: { [key: string]: any } = {}

    public exists(key): boolean {
        return this.objects[key] !== undefined
    }

    public set(key: string, value: any): Shared {
        if (!this.exists(key))
            this.objects[key] = value
        return this
    }

    public get<T>(key: string): (T|null) {
        if (!this.exists(key))
            return null
        return this.objects[key]
    }

    public remove(key: string): Shared {
        if (this.exists(key))
            delete this.objects[key]
        return this
    }
}
