import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { TimeMeasureLogger } from '../../utils/TimeMeasureLogger';
import { SimpleMapDeserializer } from '../../utils/types/json-transform';
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

    public async getCollectedMeasure(): Promise<Map<string, number>> {
        const result = await this.transport.request<Map<string, number>>(
            'timeMeasureManager.getCollectedMeasure',
            [],
            new SimpleMapDeserializer()
        );

        TimeMeasureLogger.getCollectedMeasure().forEach((value, key) => {
            if (!result.has(key)) {
                result.set(key, value);
            }
        });

        return result;
    }
}
