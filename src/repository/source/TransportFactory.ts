import { HttpTransportImpl } from './http/HttpTransportImpl';
import { RpcTransportImpl } from './rpc/RpcTransportImpl';
import { HttpTransport } from './http/HttpTransport';
import { RpcTransport } from './rpc/RpcTransport';
import { HttpTransportSyncedImpl } from './http/HttpTransportSyncedImpl';

export class TransportFactory {

    public static createHttpTransport(host: string): HttpTransport {
        return new HttpTransportSyncedImpl(host);
    }

    public static createJsonRpcHttpTransport(host: string): RpcTransport {
        return new RpcTransportImpl(new HttpTransportImpl(host));
    }

}
