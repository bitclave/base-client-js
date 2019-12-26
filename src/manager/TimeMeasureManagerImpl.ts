import { ExportMethod } from '../utils/ExportMethod';
import { TimeMeasureLogger, TimeMeasureStackItem } from '../utils/TimeMeasureLogger';
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
    public async getCollectedMeasure(): Promise<Array<TimeMeasureStackItem>> {
        return TimeMeasureLogger.getCollectedMeasure();
    }
}
