import { JsonObject } from '../repository/models/JsonObject';
import { ArrayDeserializer } from './types/json-transform';

export class TimeMeasureStackItem {

    public readonly name: string;
    public readonly calls: Array<TimeMeasureStackItem>;
    public time: number;
    public prev: string | null = null;

    public static fromJson(json: JsonObject<TimeMeasureStackItem>): TimeMeasureStackItem {
        const deserializer = new ArrayDeserializer<TimeMeasureStackItem>(TimeMeasureStackItem);
        const calls = deserializer.fromJson(json.calls);

        return new TimeMeasureStackItem(json.name, calls, json.time, json.prev);
    }

    constructor(name: string, calls: Array<TimeMeasureStackItem> = [], time: number = -1, prev: string | null = null) {
        this.name = name;
        this.calls = calls;
        this.time = time;
        this.prev = prev;
    }
}

export class TimeMeasureLogger {

    private static enabled: boolean = false;
    private static subLabel = '';
    private static readonly timers = new Map<string, number>();
    private static readonly measure = new Map<string, number>();
    private static root = new Array<TimeMeasureStackItem>();
    private static readonly stackItemsByName = new Map<string, TimeMeasureStackItem>();
    private static current = new TimeMeasureStackItem('');

    public static enableLogger(enable: boolean) {
        TimeMeasureLogger.enabled = enable;
    }

    public static setSubLabel(label: string) {
        TimeMeasureLogger.subLabel = label;
    }

    public static time(label: string) {
        if (TimeMeasureLogger.enabled) {
            TimeMeasureLogger.timers.set(label, TimeMeasureLogger.getTimeMs());
            TimeMeasureLogger.addToStack(label);
        }
    }

    public static timeEnd(label: string, time?: number) {
        if (TimeMeasureLogger.enabled) {
            const ms = TimeMeasureLogger.timers.get(label);

            if (ms === undefined || !TimeMeasureLogger.stackItemsByName.has(label)) {
                console.log(`timer for '${label}' not found!`);

            } else {
                const result = time !== undefined ? time : TimeMeasureLogger.getTimeMs() - ms;
                TimeMeasureLogger.measure.set(TimeMeasureLogger.constructLabel(label), result);
                TimeMeasureLogger.removeFromStack(label, result);
            }
        }
    }

    public static getCollectedMeasure(): Array<TimeMeasureStackItem> {
        return TimeMeasureLogger.root.slice(0, TimeMeasureLogger.root.length);
    }

    public static clearCollectedMeasure() {
        TimeMeasureLogger.measure.clear();
        TimeMeasureLogger.timers.clear();
        TimeMeasureLogger.root = new Array<TimeMeasureStackItem>();
        TimeMeasureLogger.stackItemsByName.clear();
        TimeMeasureLogger.current = new TimeMeasureStackItem('');
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

    private static addToStack(label: string): void {
        const item = new TimeMeasureStackItem(TimeMeasureLogger.constructLabel(label));
        item.prev = TimeMeasureLogger.current.name;
        TimeMeasureLogger.stackItemsByName.set(label, item);

        if (TimeMeasureLogger.root.length <= 0 ||
            TimeMeasureLogger.root.length >= 0 && TimeMeasureLogger.current.prev === null) {
            TimeMeasureLogger.current = item;
            TimeMeasureLogger.root.push(TimeMeasureLogger.current);
            return;
        }

        TimeMeasureLogger.current.calls.push(item);
        TimeMeasureLogger.current = item;
    }

    private static removeFromStack(label: string, time: number): void {
        const forClose = TimeMeasureLogger.stackItemsByName.get(label);

        if (TimeMeasureLogger.current.name !== forClose!.name) {
            throw new Error(`Violation of the order of closing counters.` +
                `close ${TimeMeasureLogger.current.name} before ${forClose!.name}`);
        }
        TimeMeasureLogger.current.time = time;
        const prev = TimeMeasureLogger.stackItemsByName.get(TimeMeasureLogger.current.prev || '');
        TimeMeasureLogger.current = prev || new TimeMeasureStackItem('');
    }
}
