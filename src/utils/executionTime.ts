export default class ExecutionTime {
    private startedAt: number = Date.now();
    private endAt: number = 0;
    public stop(){
        this.endAt = Date.now();
        return this.endAt - this.startedAt;
    }
}