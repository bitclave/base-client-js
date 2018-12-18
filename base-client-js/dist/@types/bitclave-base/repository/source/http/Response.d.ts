export declare class Response {
    private _json;
    private _status;
    constructor(json: string, status: number);
    readonly json: object;
    readonly status: number;
}
