import { FieldData } from './FieldData';
export declare class SharedData {
    readonly data: Map<string, Array<FieldData>>;
    readonly size: number;
    set(data: FieldData): void;
    get(ancestor: string, root?: string): Map<string, FieldData>;
    getKeyValue(ancestor: string, root?: string): Map<string, string | undefined>;
    getDataTo(to: string): Array<FieldData>;
    toList(): Array<FieldData>;
    extractKeysByRoot(): Map<string, Map<string, FieldData>>;
}
