import { ClassCreator, DeepCopy } from './DeepCopy';
export declare class DataRequest extends DeepCopy<DataRequest> {
    id: number;
    fromPk: string;
    toPk: string;
    rootPk: string;
    requestData: string;
    responseData: string;
    constructor(fromPk?: string, toPk?: string, rootPk?: string, requestData?: string, responseData?: string);
    toJson(): object;
    protected getClass(): ClassCreator<DataRequest>;
}
