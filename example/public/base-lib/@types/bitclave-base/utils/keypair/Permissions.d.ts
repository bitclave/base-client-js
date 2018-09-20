export declare class Permissions {
    fields: Map<string, AccessRight>;
    constructor(fields?: Map<string, AccessRight>);
}
export declare enum AccessRight {
    R = 0,
    RW = 1
}
