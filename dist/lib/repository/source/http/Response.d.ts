import { JsonObject } from '../../models/JsonObject';
export declare class Response<T> {
    private readonly _json;
    private readonly _status;
    constructor(json: string | object, status: number);
    readonly json: JsonObject<T>;
    readonly originJson: object;
    readonly status: number;
}
