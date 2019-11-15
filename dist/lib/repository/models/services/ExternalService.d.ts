import { ClassCreator, DeepCopy } from '../DeepCopy';
export declare class ExternalService extends DeepCopy<ExternalService> {
    readonly publicKey: string;
    readonly endpoint: string;
    constructor(publicKey?: string, endpoint?: string);
    toJson(): object;
    protected getClass(): ClassCreator<ExternalService>;
}
