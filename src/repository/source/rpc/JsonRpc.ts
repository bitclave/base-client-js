export class JsonRpc {

    public readonly jsonrpc: string = '2.0';
    public readonly method: string;
    public readonly params: Array<object>;
    public readonly id: number;

    constructor(method: string, params: Array<object>, id: number) {
        this.method = method;
        this.params = params;
        this.id = id;
    }
}
