export class Response<T> {

    private readonly _json: JsonObject<T>;
    private readonly _status: number;

    constructor(json: string | object, status: number) {
        try {
            this._json = JSON.parse(json as string);
        } catch (e) {
            this._json = json as JsonObject<T>;
        }

        this._status = status;
    }

    public get json(): JsonObject<T> {
        return this._json;
    }

    public get status(): number {
        return this._status;
    }

}
