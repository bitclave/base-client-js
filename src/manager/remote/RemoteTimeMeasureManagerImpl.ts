import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { TimeMeasureLogger, TimeMeasureStackItem } from '../../utils/TimeMeasureLogger';
import { ArrayDeserializer } from '../../utils/types/json-transform';
import { TimeMeasureManager } from '../TimeMeasureManager';

export class RemoteTimeMeasureManagerImpl implements TimeMeasureManager {

    constructor(private readonly transport: RpcTransport) {
    }

    public async clearCollectedMeasure(): Promise<void> {
        await this.transport.request('timeMeasureManager.clearCollectedMeasure', []);
        TimeMeasureLogger.clearCollectedMeasure();
    }

    public async enableLogger(enable: boolean): Promise<void> {
        await this.transport.request('timeMeasureManager.enableLogger', [enable]);
        TimeMeasureLogger.enableLogger(enable);
    }

    public async getCollectedMeasure(): Promise<Array<TimeMeasureStackItem>> {
        const isEnabledLogger = TimeMeasureLogger.isEnabled();
        TimeMeasureLogger.enableLogger(false);

        const result = await this.transport.request<Array<TimeMeasureStackItem>>(
            'timeMeasureManager.getCollectedMeasure',
            [],
            new ArrayDeserializer(TimeMeasureStackItem)
        );

        TimeMeasureLogger.enableLogger(isEnabledLogger);

        return TimeMeasureLogger.getCollectedMeasure().concat(result);
    }
}
