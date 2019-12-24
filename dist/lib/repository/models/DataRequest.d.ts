import { ClassCreator, DeepCopy } from './DeepCopy';
import { JsonObject } from './JsonObject';
export declare class DataRequest extends DeepCopy<DataRequest> {
    id: number;
    fromPk: string;
    toPk: string;
    rootPk: string;
    requestData: string;
    responseData: string;
    static fromJson(json: JsonObject<DataRequest>): DataRequest;
    constructor(fromPk?: string, toPk?: string, rootPk?: string, requestData?: string, responseData?: string);
    toJson(): object;
    protected getClass(): ClassCreator<DataRequest>;
}
