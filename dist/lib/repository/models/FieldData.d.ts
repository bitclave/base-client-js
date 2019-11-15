import { ClassCreator, DeepCopy } from './DeepCopy';
export declare class FieldData extends DeepCopy<FieldData> {
    from: string;
    to: string;
    root: string;
    key: string;
    value: string | undefined;
    constructor(from?: string, to?: string, root?: string, key?: string, value?: string | undefined);
    toJson(): object;
    protected getClass(): ClassCreator<FieldData>;
}
