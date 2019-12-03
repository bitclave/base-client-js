import { ClassCreator, DeepCopy } from './DeepCopy';
import { JsonObject } from './JsonObject';
export declare class Site extends DeepCopy<Site> {
    readonly id: number;
    readonly origin: string;
    readonly publicKey: string;
    readonly confidential: boolean;
    static fromJson(json: JsonObject<Site>): Site;
    constructor(id?: number, origin?: string, publicKey?: string, confidential?: boolean);
    toJson(): object;
    protected getClass(): ClassCreator<Site>;
}
