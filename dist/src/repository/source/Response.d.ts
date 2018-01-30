export default class Response {
    private _json;
    private _status;
    constructor(json: string, status: number);
    readonly json: any;
    readonly status: number;
}
