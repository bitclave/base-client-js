export declare class JsonRpc {
    readonly jsonrpc: string;
    readonly method: string;
    readonly params: Array<object>;
    readonly id: number;
    constructor(method: string, params: Array<object>, id: number);
}
