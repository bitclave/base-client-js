export declare class TimeMeasureLogger {
    private static enabled;
    private static timers;
    private static measure;
    static enableLogger(enable: boolean): void;
    static time(label: string): void;
    static timeEnd(label: string): void;
    static getCollectedMeasure(): Map<string, number>;
    static clearCollectedMeasure(): void;
    private static getTimeMs;
}
