import { JsonDeserializer } from '../../../utils/types/json-transform';
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

    public async request<T>(
        method: string,
        arg: Array<object | Primitive | undefined | null>,
        deserializer?: JsonDeserializer<T>
    ): Promise<T> {
        this.id++;

        const data = JsonRpc.request(this.id, method, arg);

        try {
            const response = await this.transport.sendRequest<JsonRpc>('/', HttpMethod.Post, data);
            const jsonRpc = Object.assign(JsonRpc.response(0, ''), response.json);

            return deserializer
                   ? deserializer.fromJson(jsonRpc.getResult())
                   : jsonRpc.getResult();

        } catch (e) {
            throw Object.assign(JsonRpc.response(0, ''), e.json);
        }
    }

    public disconnect(): void {
        // ignore
    }

    public addInterceptor(interceptor: RpcInterceptor): this {
        this.transport.addInterceptor(new JsonRpcHttpInterceptorAdapter(interceptor));

        return this;
    }
}
