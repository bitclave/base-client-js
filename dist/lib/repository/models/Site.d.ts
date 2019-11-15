import { ClassCreator, DeepCopy } from './DeepCopy';
export declare class Site extends DeepCopy<Site> {
    readonly id: number;
    readonly origin: string;
    readonly publicKey: string;
    readonly confidential: boolean;
    constructor(id?: number, origin?: string, publicKey?: string, confidential?: boolean);
    toJson(): object;
    protected getClass(): ClassCreator<Site>;
}
