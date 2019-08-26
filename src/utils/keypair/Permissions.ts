export class Permissions {

    public static EMPTY: Permissions = new Permissions(new Map());

    public readonly fields: Map<string, AccessRight>;

    constructor(fields: Map<string, AccessRight> = new Map()) {
        this.fields = fields || new Map();
    }
}

export enum AccessRight {
    R = 0,
    RW = 1
}
