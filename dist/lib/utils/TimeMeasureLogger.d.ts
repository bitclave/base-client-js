export declare class TimeMeasureLogger {
    private static enabled;
    private static subLabel;
    private static readonly timers;
    private static readonly measure;
    static enableLogger(enable: boolean): void;
    static setSubLabel(label: string): void;
    static time(label: string): void;
    static timeEnd(label: string): void;
    static getCollectedMeasure(): Map<string, number>;
    static clearCollectedMeasure(): void;
    private static getTimeMs;
    private static constructLabel;
}
