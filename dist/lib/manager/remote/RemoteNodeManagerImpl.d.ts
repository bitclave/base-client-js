import { DataRequest } from '../../repository/models/DataRequest';
import { Site } from '../../repository/models/Site';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { NodeManager } from '../NodeManager';
export declare class RemoteNodeManagerImpl implements NodeManager {
    private readonly transport;
    constructor(transport: RpcTransport);
    getGrandAccessRecords(publicKeyFrom: string, publicKeyTo: string): Promise<Array<DataRequest>>;
    getNodeVersion(): Promise<string>;
    getNonce(publicKey: string): Promise<number>;
    getSiteData(origin: string): Promise<Site>;
}
