import { RpcTransport } from './RpcTransport';
import { HttpTransport } from '../http/HttpTransport';
export declare class RpcTransportImpl implements RpcTransport {
    private transport;
    private id;
    constructor(httpTransport: HttpTransport);
    request(method: string, arg: any): Promise<any>;
    disconnect(): void;
}
