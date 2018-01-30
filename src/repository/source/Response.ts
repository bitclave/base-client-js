export default class Response {

    private _json: any;
    status: number;


    constructor(json: string, status: number) {
        this._json = JSON.parse(json);
        this.status = status;
    }

    get json(): any {
        return this._json;
    }

}
