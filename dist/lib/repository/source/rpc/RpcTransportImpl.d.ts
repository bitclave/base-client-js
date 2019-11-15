import { HttpTransport } from '../http/HttpTransport';
import { RpcInterceptor } from './RpcInterceptor';
import { RpcTransport } from './RpcTransport';
export declare class RpcTransportImpl implements RpcTransport {
    private transport;
    private id;
    constructor(httpTransport: HttpTransport);
    request<T>(method: string, arg: object): Promise<T>;
    disconnect(): void;
    addInterceptor(interceptor: RpcInterceptor): this;
}
