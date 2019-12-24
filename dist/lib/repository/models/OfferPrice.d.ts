import { AccessRight } from '../../utils/keypair/Permissions';
import { ClassCreator, DeepCopy } from './DeepCopy';
import { OfferPriceRules } from './OfferPriceRules';
export declare class OfferPrice extends DeepCopy<OfferPrice> {
    readonly id: number;
    readonly description: string;
    readonly worth: string;
    readonly rules: Array<OfferPriceRules>;
    static fromJson(json: object): OfferPrice;
    constructor(id?: number, description?: string, worth?: string, rules?: Array<OfferPriceRules>);
    toJson(): object;
    isRelevant(data: Map<string, string>): boolean;
    getFieldsForAcception(accessRight: AccessRight): Map<string, AccessRight>;
    protected deepCopyFromJson(): OfferPrice;
    protected getClass(): ClassCreator<OfferPrice>;
}
