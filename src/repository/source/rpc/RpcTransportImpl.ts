import { HttpMethod } from '../http/HttpMethod';
import { HttpTransport } from '../http/HttpTransport';
import { RpcTransport } from './RpcTransport';

declare interface JsonRpcResponse<T> {
    result: T;
}

export class RpcTransportImpl implements RpcTransport {

    private transport: HttpTransport;
    private id: number = 0;

    constructor(httpTransport: HttpTransport) {
        this.transport = httpTransport;
    }

    public request<T>(method: string, arg: object): Promise<T> {
        this.id++;
        const data = {
            jsonrpc: '2.0',
            method: `${method}`,
            params: [arg],
            id: this.id
        };
        return this.transport.sendRequest('/', HttpMethod.Post, data)
            .then(response => (response.json as JsonRpcResponse<T>).result);
    }

    public disconnect(): void {
        // ignore
    }

}
