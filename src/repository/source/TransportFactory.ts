import { HttpTransportImpl } from './http/HttpTransportImpl';
import { RpcTransportImpl } from './rpc/RpcTransportImpl';
import { HttpTransport } from './http/HttpTransport';
import { RpcTransport } from './rpc/RpcTransport';

export class TransportFactory {

    public static createHttpTransport(host: string): HttpTransport {
        return new HttpTransportImpl(host);
    }

    public static createJsonRpcHttpTransport(host: string): RpcTransport {
        return new RpcTransportImpl(new HttpTransportImpl(host));
    }

}
