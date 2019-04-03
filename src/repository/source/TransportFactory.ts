import { Logger } from '../../utils/BasicLogger';
import { HttpTransport } from './http/HttpTransport';
import { HttpTransportImpl } from './http/HttpTransportImpl';
import { HttpTransportSyncedImpl } from './http/HttpTransportSyncedImpl';
import { RpcTransport } from './rpc/RpcTransport';
import { RpcTransportImpl } from './rpc/RpcTransportImpl';

export class TransportFactory {

    public static createHttpTransport(host: string, loggerService: Logger): HttpTransport {
        return new HttpTransportSyncedImpl(host, loggerService);
    }

    public static createJsonRpcHttpTransport(host: string): RpcTransport {
        return new RpcTransportImpl(new HttpTransportImpl(host));
    }

}
