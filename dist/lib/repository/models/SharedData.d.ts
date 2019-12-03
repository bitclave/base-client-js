import { FieldData } from './FieldData';
import { JsonObject } from './JsonObject';
import { JsonTransform } from './JsonTransform';
export declare class SharedData extends JsonTransform {
    readonly data: Map<string, Array<FieldData>>;
    static fromJson(json: JsonObject<object>): SharedData;
    toJson(): object;
    readonly size: number;
    set(data: FieldData): void;
    get(ancestor: string, root?: string): Map<string, FieldData>;
    getKeyValue(ancestor: string, root?: string): Map<string, string | undefined>;
    getDataTo(to: string): Array<FieldData>;
    toList(): Array<FieldData>;
    extractKeysByRoot(): Map<string, Map<string, FieldData>>;
}
