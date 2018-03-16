let JsonRpcWs: any;

if (typeof window !== 'undefined') {
    JsonRpcWs = require('json-rpc-ws/browser');
} else {
    JsonRpcWs = require('json-rpc-ws');
}

import { RpcTransport } from './RpcTransport';

export default class RpcTransportImpl implements RpcTransport {


    private client: any = JsonRpcWs.createClient();
    private host: string;

    constructor(host: string) {
        this.host = host;
    }

    public request(method: string, arg: any): Promise<any> {
        return this.checkConnection()
            .then(() => new Promise<any>(resolve => {
                this.client.send(method, [JSON.stringify(arg)], (result: any) => {
                    resolve(result);
                });
            }));
    }

    public disconnect(): void {
        this.client.socket.close();
    }

    private checkConnection(): Promise<void> {
        return new Promise(resolve => {
            if (this.client.socket === undefined || this.client.socket.readyState != 1) {
                this.client.connect(this.host, resolve);
            } else {
                resolve();
            }
        });
    }
}
