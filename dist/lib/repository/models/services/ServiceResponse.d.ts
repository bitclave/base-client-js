import { ClassCreator, DeepCopy } from '../DeepCopy';
import { JsonObject } from '../JsonObject';
export declare class ServiceResponse extends DeepCopy<ServiceResponse> {
    readonly headers: Map<string, Array<string>>;
    readonly status: number;
    readonly body?: object;
    static fromJson(json: JsonObject<ServiceResponse>): ServiceResponse;
    constructor(headers?: Map<string, Array<string>>, status?: number, body?: object);
    toJson(): object;
    protected deepCopyFromJson(): ServiceResponse;
    protected getClass(): ClassCreator<ServiceResponse>;
}
