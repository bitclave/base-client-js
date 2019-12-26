import { TimeMeasureStackItem } from '../utils/TimeMeasureLogger';

export interface TimeMeasureManager {

    enableLogger(enable: boolean): Promise<void>;

    getCollectedMeasure(): Promise<Array<TimeMeasureStackItem>>;

    clearCollectedMeasure(): Promise<void>;
}
