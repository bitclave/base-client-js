export default class Response {

    private _json: any;
    private _status: number;


    constructor(json: string, status: number) {
        this._json = JSON.parse(json);
        this._status = status;
    }

    get json(): any {
        return this._json;
    }

    get status(): number {
        return this._status;
    }

}
