import { ClassCreator, DeepCopy } from './DeepCopy';
import { JsonObject } from './JsonObject';
export declare class FieldData extends DeepCopy<FieldData> {
    from: string;
    to: string;
    root: string;
    key: string;
    value: string | undefined;
    static fromJson(json: JsonObject<FieldData>): FieldData;
    constructor(from?: string, to?: string, root?: string, key?: string, value?: string | undefined);
    toJson(): object;
    protected getClass(): ClassCreator<FieldData>;
}
