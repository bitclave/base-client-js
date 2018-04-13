export class Response {

    private _json: any;
    private _status: number;

    constructor(json: string, status: number) {
        try {
            this._json = JSON.parse(json);
        } catch (e) {
            this._json = json;
        }

        this._status = status;
    }

    get json(): object {
        return this._json;
    }

    get status(): number {
        return this._status;
    }

}
