import { TimeMeasureStackItem } from '../utils/TimeMeasureLogger';
import { TimeMeasureManager } from './TimeMeasureManager';
export declare class TimeMeasureManagerImpl implements TimeMeasureManager {
    clearCollectedMeasure(): Promise<void>;
    enableLogger(enable: boolean): Promise<void>;
    getCollectedMeasure(): Promise<Array<TimeMeasureStackItem>>;
}
