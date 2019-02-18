import { HttpTransportImpl } from './http/HttpTransportImpl';
import { RpcTransportImpl } from './rpc/RpcTransportImpl';
import { HttpTransport } from './http/HttpTransport';
import { RpcTransport } from './rpc/RpcTransport';
import { HttpTransportSyncedImpl } from './http/HttpTransportSyncedImpl';
import { Logger } from './../../utils/BasicLogger';

export class TransportFactory {

    public static createHttpTransport(host: string, loggerService :Logger): HttpTransport {
        return new HttpTransportSyncedImpl(host, loggerService);
    }

    public static createJsonRpcHttpTransport(host: string): RpcTransport {
        return new RpcTransportImpl(new HttpTransportImpl(host));
    }

}
