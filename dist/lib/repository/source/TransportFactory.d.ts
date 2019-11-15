import { Logger } from '../../utils/BasicLogger';
import { HttpTransport } from './http/HttpTransport';
import { RpcTransport } from './rpc/RpcTransport';
export declare class TransportFactory {
    static createHttpTransport(host: string, loggerService: Logger): HttpTransport;
    static createJsonRpcHttpTransport(host: string): RpcTransport;
}
