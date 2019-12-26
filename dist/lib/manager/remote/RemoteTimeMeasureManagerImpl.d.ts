import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { TimeMeasureStackItem } from '../../utils/TimeMeasureLogger';
import { TimeMeasureManager } from '../TimeMeasureManager';
export declare class RemoteTimeMeasureManagerImpl implements TimeMeasureManager {
    private readonly transport;
    constructor(transport: RpcTransport);
    clearCollectedMeasure(): Promise<void>;
    enableLogger(enable: boolean): Promise<void>;
    getCollectedMeasure(): Promise<Array<TimeMeasureStackItem>>;
}
