export class TimeMeasureLogger {

    private static enabled: boolean = false;
    private static subLabel = '';
    private static readonly timers = new Map<string, number>();
    private static readonly measure = new Map<string, number>();

    public static enableLogger(enable: boolean) {
        TimeMeasureLogger.enabled = enable;
    }

    public static setSubLabel(label: string) {
        TimeMeasureLogger.subLabel = label;
    }

    public static time(label: string) {
        if (TimeMeasureLogger.enabled) {
            TimeMeasureLogger.timers.set(label, TimeMeasureLogger.getTimeMs());
        }
    }

    public static timeEnd(label: string) {
        if (TimeMeasureLogger.enabled) {
            const ms = TimeMeasureLogger.timers.get(label);

            if (ms === undefined) {
                console.log(`timer for '${label}' not found!`);

            } else {
                const result = TimeMeasureLogger.getTimeMs() - ms;
                TimeMeasureLogger.measure.set(TimeMeasureLogger.constructLabel(label), result);
            }
        }
    }

    public static getCollectedMeasure(): Map<string, number> {
        return new Map<string, number>(TimeMeasureLogger.measure);
    }

    public static clearCollectedMeasure() {
        TimeMeasureLogger.measure.clear();
        TimeMeasureLogger.timers.clear();
    }

    private static getTimeMs(): number {
        if (typeof window !== 'undefined' && typeof window.performance !== 'undefined') {
            return window.performance.now();

        } else if (typeof process !== 'undefined' && typeof process.hrtime !== 'undefined') {
            const time = process.hrtime();
            return (time[0] * 1e9 + time[1]) * 0.000001;

        } else {
            return new Date().getTime();
        }
    }

    private static constructLabel(originLabel: string): string {
        return TimeMeasureLogger.subLabel && TimeMeasureLogger.subLabel.length > 0
               ? `${TimeMeasureLogger.subLabel}-${originLabel}`
               : originLabel;
    }
}
