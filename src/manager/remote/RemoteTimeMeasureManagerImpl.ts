import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { TimeMeasureLogger, TimeMeasureStackItem } from '../../utils/TimeMeasureLogger';
import { ArrayDeserializer } from '../../utils/types/json-transform';
import { TimeMeasureManager } from '../TimeMeasureManager';

export class RemoteTimeMeasureManagerImpl implements TimeMeasureManager {

    constructor(private readonly transport: RpcTransport) {
    }

    public async clearCollectedMeasure(): Promise<void> {
        TimeMeasureLogger.clearCollectedMeasure();
        return this.transport.request('timeMeasureManager.clearCollectedMeasure', []);
    }

    public async enableLogger(enable: boolean): Promise<void> {
        TimeMeasureLogger.enableLogger(enable);
        return this.transport.request('timeMeasureManager.enableLogger', [enable]);
    }

    public async getCollectedMeasure(): Promise<Array<TimeMeasureStackItem>> {
        const result = await this.transport.request<Array<TimeMeasureStackItem>>(
            'timeMeasureManager.getCollectedMeasure',
            [],
            new ArrayDeserializer(TimeMeasureStackItem)
        );

        return result.concat(TimeMeasureLogger.getCollectedMeasure());
    }
}
