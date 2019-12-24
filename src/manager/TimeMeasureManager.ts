export interface TimeMeasureManager {

    enableLogger(enable: boolean): Promise<void>;

    getCollectedMeasure(): Promise<Map<string, number>>;

    clearCollectedMeasure(): Promise<void>;
}
