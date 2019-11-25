import { Primitive } from '../../../utils/types/Primitive';
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

    public request<T>(method: string, arg: Array<object | Primitive | undefined | null>): Promise<T> {
        this.id++;

        const data = JsonRpc.request(this.id, method, arg);

        return this.transport.sendRequest<JsonRpc>('/', HttpMethod.Post, data)
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
