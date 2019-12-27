import { JsonObject } from '../repository/models/JsonObject';
import { JsonTransform } from '../repository/models/JsonTransform';
import { ArrayDeserializer } from './types/json-transform';

export class TimeMeasureStackItem extends JsonTransform {

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
        super();

        this.name = name;
        this.calls = calls;
        this.time = time;
        this.prev = prev;
    }

    public toJson(): object {
        const json = JSON.parse(JSON.stringify(this));
        json.calls = this.calls.map(item => item.toJson());

        return json;
    }
}

export class TimeMeasureLogger {

    private static enabled: boolean = false;
    private static subLabel = '';
    private static readonly timers = new Map<string, number>();
    private static root = new Array<TimeMeasureStackItem>();
    private static readonly stackItemsByName = new Map<string, TimeMeasureStackItem>();
    private static current = new TimeMeasureStackItem('');

    public static isEnabled(): boolean {
        return TimeMeasureLogger.enabled;
    }

    public static enableLogger(enable: boolean) {
        TimeMeasureLogger.enabled = enable;
    }

    public static setSubLabel(label: string) {
        TimeMeasureLogger.subLabel = label;
    }

    public static time(label: string) {
        if (TimeMeasureLogger.enabled) {
            if (TimeMeasureLogger.timers.has(label)) {
                throw new Error(`Timer ${label} already exist`);
            }

            TimeMeasureLogger.timers.set(label, TimeMeasureLogger.getTimeMs());
            TimeMeasureLogger.addToStack(TimeMeasureLogger.constructLabel(label));
        }
    }

    public static timeEnd(label: string, time?: number) {
        if (TimeMeasureLogger.enabled) {
            const ms = TimeMeasureLogger.timers.get(label);
            const updatedLabel = TimeMeasureLogger.constructLabel(label);

            if (ms === undefined || !TimeMeasureLogger.stackItemsByName.has(updatedLabel)) {
                console.log(`timer for '${label}' not found!`);

            } else {
                const result = time !== undefined ? time : TimeMeasureLogger.getTimeMs() - ms;
                TimeMeasureLogger.removeFromStack(updatedLabel, result);
            }
        }
    }

    public static getCollectedMeasure(): Array<TimeMeasureStackItem> {
        return TimeMeasureLogger.root.slice(0, TimeMeasureLogger.root.length);
    }

    public static clearCollectedMeasure() {
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
        const item = new TimeMeasureStackItem(label);
        item.prev = TimeMeasureLogger.current.name;
        TimeMeasureLogger.stackItemsByName.set(label, item);

        if (TimeMeasureLogger.root.length <= 0 ||
            TimeMeasureLogger.current.prev === null) {
            TimeMeasureLogger.current = item;
            TimeMeasureLogger.root.push(TimeMeasureLogger.current);
            return;
        }

        TimeMeasureLogger.current.calls.push(item);
        TimeMeasureLogger.current = item;
    }

    private static removeFromStack(label: string, time: number): void {
        const forClose = TimeMeasureLogger.stackItemsByName.get(label);

        if (forClose) {
            forClose.time = time;
            const prev = TimeMeasureLogger.getNotClosed(forClose.prev);
            const currentNotClosed = forClose.calls.filter(item => item.time < 0);

            currentNotClosed.forEach(item => {
                const pos = forClose.calls.indexOf(item);

                if (pos > -1) {
                    forClose.calls.splice(pos, 1);
                }
            });

            currentNotClosed.forEach(item => {
                if (!prev && !TimeMeasureLogger.root.includes(item)) {
                    TimeMeasureLogger.root.push(item);

                } else if (prev) {
                    prev.calls.push(item);
                }
            });

            if (currentNotClosed.length > 0) {
                TimeMeasureLogger.current = currentNotClosed[currentNotClosed.length - 1];
                return;
            }

            TimeMeasureLogger.current = prev || new TimeMeasureStackItem('');
        }
    }

    private static getNotClosed(from: string | null): TimeMeasureStackItem | undefined {
        const prev = TimeMeasureLogger.stackItemsByName.get(from || '');

        if (!prev) {
            return undefined;
        }

        return prev.time < 0 ? prev : TimeMeasureLogger.getNotClosed(prev.prev || '');
    }
}
