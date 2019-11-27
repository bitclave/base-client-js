import { DataRequest } from '../../repository/models/DataRequest';
import { Site } from '../../repository/models/Site';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { ArrayDeserializer } from '../../utils/types/json-transform/deserializers/ArrayDeserializer';
import { NodeManager } from '../NodeManager';

export class RemoteNodeManagerImpl implements NodeManager {

    constructor(private readonly transport: RpcTransport) {
    }

    public getGrandAccessRecords(publicKeyFrom: string, publicKeyTo: string): Promise<Array<DataRequest>> {
        return this.transport.request(
            'nodeManager.getRequests',
            [publicKeyFrom, publicKeyTo],
            new ArrayDeserializer(DataRequest)
        );
    }

    public getNodeVersion(): Promise<string> {
        return this.transport.request('nodeManager.getNodeVersion', []);
    }

    public getNonce(publicKey: string): Promise<number> {
        return this.transport.request('nodeManager.getNonce', [publicKey]);
    }

    public getSiteData(origin: string): Promise<Site> {
        return this.transport.request('nodeManager.getSiteData', [origin], Site);
    }
}
