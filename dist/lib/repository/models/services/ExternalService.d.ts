import { ClassCreator, DeepCopy } from '../DeepCopy';
import { JsonObject } from '../JsonObject';
export declare class ExternalService extends DeepCopy<ExternalService> {
    readonly publicKey: string;
    readonly endpoint: string;
    static fromJson(json: JsonObject<ExternalService>): ExternalService;
    constructor(publicKey?: string, endpoint?: string);
    toJson(): object;
    protected getClass(): ClassCreator<ExternalService>;
}
