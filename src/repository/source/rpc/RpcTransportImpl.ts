import { HttpMethod } from '../http/HttpMethod';
import { HttpTransport } from '../http/HttpTransport';
import { JsonRpc } from './JsonRpc';
import { JsonRpcHttpInterceptorAdapter } from './JsonRpcHttpInterceptorAdapter';
import { RpcInterceptor } from './RpcInterceptor';
import { RpcTransport } from './RpcTransport';

export class RpcTransportImpl implements RpcTransport {

    private transport: HttpTransport;
    private id: number = 0;

    constructor(httpTransport: HttpTransport) {
        this.transport = httpTransport;
    }

    public request<T>(method: string, arg: object): Promise<T> {
        this.id++;
        const data = new JsonRpc(method, [arg], this.id);

        return this.transport.sendRequest('/', HttpMethod.Post, data)
            .then(response => response.json.result as T);
    }

    public disconnect(): void {
        // ignore
    }

    public addInterceptor(interceptor: RpcInterceptor): this {
        this.transport.addInterceptor(new JsonRpcHttpInterceptorAdapter(interceptor));

        return this;
    }
}
