import { ClassCreator, DeepCopy } from './DeepCopy';

export class FieldData extends DeepCopy<FieldData> {
    public from: string;
    public to: string;
    public root: string;
    public key: string;
    public value: string | undefined;

    constructor(from: string = '', to: string = '', root: string = '', key: string = '', value?: string | undefined) {
        super();

        this.from = from || '';
        this.to = to || '';
        this.root = root || '';
        this.key = key || '';
        this.value = value || '';
    }

    public toJson(): object {
        return this;
    }

    protected getClass(): ClassCreator<FieldData> {
        return FieldData;
    }
}
