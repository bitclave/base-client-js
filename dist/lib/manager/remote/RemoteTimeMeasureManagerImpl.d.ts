import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { TimeMeasureManager } from '../TimeMeasureManager';
export declare class RemoteTimeMeasureManagerImpl implements TimeMeasureManager {
    private readonly transport;
    constructor(transport: RpcTransport);
    clearCollectedMeasure(): Promise<void>;
    enableLogger(enable: boolean): Promise<void>;
    getCollectedMeasure(): Promise<Map<string, number>>;
}
