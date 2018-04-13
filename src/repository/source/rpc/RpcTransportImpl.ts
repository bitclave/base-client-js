import { RpcTransport } from './RpcTransport';
import { HttpTransport } from '../http/HttpTransport';
import { HttpMethod } from '../http/HttpMethod';

export class RpcTransportImpl implements RpcTransport {

    private transport: HttpTransport;
    private id: number = 0;

    constructor(httpTransport: HttpTransport) {
        this.transport = httpTransport;
    }

    public request(method: string, arg: any): Promise<any> {
        this.id++;
        const data: any = {
            'jsonrpc': '2.0',
            method: method,
            params: [arg],
            id: this.id
        };
        return this.transport.sendRequest('/', HttpMethod.Post, data)
            .then(response => response.json['result']);
    }

    public disconnect(): void {
    }

}
