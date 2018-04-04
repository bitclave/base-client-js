import { RpcTransport } from './RpcTransport';
export default class RpcTransportImpl implements RpcTransport {
    private client;
    private host;
    constructor(host: string);
    request(method: string, arg: any): Promise<any>;
    disconnect(): void;
    private checkConnection();
}
