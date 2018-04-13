import { HttpTransport } from './http/HttpTransport';
import { RpcTransport } from './rpc/RpcTransport';
export declare class TransportFactory {
    static createHttpTransport(host: string): HttpTransport;
    static createJsonRpcHttpTransport(host: string): RpcTransport;
}
