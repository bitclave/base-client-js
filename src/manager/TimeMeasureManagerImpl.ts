import { ExportMethod } from '../utils/ExportMethod';
import { TimeMeasureLogger } from '../utils/TimeMeasureLogger';
import { TimeMeasureManager } from './TimeMeasureManager';

export class TimeMeasureManagerImpl implements TimeMeasureManager {

    @ExportMethod({public: true})
    public async clearCollectedMeasure(): Promise<void> {
        TimeMeasureLogger.clearCollectedMeasure();
    }

    @ExportMethod({public: true})
    public async enableLogger(enable: boolean): Promise<void> {
        TimeMeasureLogger.enableLogger(enable);
    }

    @ExportMethod({public: true})
    public async getCollectedMeasure(): Promise<Map<string, number>> {
        return TimeMeasureLogger.getCollectedMeasure();
    }
}
