export default class Response {
    private _json;
    status: number;
    constructor(json: string, status: number);
    readonly json: any;
}
