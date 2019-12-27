import { JsonObject } from '../repository/models/JsonObject';
import { JsonTransform } from '../repository/models/JsonTransform';
export declare class TimeMeasureStackItem extends JsonTransform {
    readonly name: string;
    readonly calls: Array<TimeMeasureStackItem>;
    time: number;
    prev: string | null;
    static fromJson(json: JsonObject<TimeMeasureStackItem>): TimeMeasureStackItem;
    constructor(name: string, calls?: Array<TimeMeasureStackItem>, time?: number, prev?: string | null);
    toJson(): object;
}
export declare class TimeMeasureLogger {
    private static enabled;
    private static subLabel;
    private static readonly timers;
    private static root;
    private static readonly stackItemsByName;
    private static current;
    static isEnabled(): boolean;
    static enableLogger(enable: boolean): void;
    static setSubLabel(label: string): void;
    static time(label: string): void;
    static timeEnd(label: string, time?: number): void;
    static getCollectedMeasure(): Array<TimeMeasureStackItem>;
    static clearCollectedMeasure(): void;
    private static getTimeMs;
    private static constructLabel;
    private static addToStack;
    private static removeFromStack;
    private static getNotClosed;
}
