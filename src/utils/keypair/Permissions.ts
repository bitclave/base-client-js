export class Permissions {

    fields: Map<string, AccessRight>;

    constructor(fields: Map<string, AccessRight> = new Map()) {
        this.fields = fields;
    }

}

export enum AccessRight {
    R = 0,
    RW = 1
}
