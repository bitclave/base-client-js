export class FieldData {
    public from: string;
    public to: string;
    public root: string;
    public key: string;
    public value: string | undefined;

    constructor(from: string, to: string, root: string, key: string, value?: string | undefined) {
        this.from = from;
        this.to = to;
        this.root = root;
        this.key = key;
        this.value = value;
    }
}
