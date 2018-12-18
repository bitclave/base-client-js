import { OfferPriceRules } from './OfferPriceRules';
import { AccessRight } from '../../utils/keypair/Permissions';
export declare class OfferPrice {
    id: number;
    description: string;
    worth: string;
    rules: Array<OfferPriceRules>;
    constructor(id?: number, description?: string, worth?: string, rules?: Array<OfferPriceRules>);
    toJson(): any;
    isRelevant(data: Map<string, string>): boolean;
    getFieldsForAcception(accessRight: AccessRight): Map<string, AccessRight>;
}
