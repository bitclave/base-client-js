import { CompareAction } from './CompareAction';
import { ClassCreator, DeepCopy } from './DeepCopy';
export declare class OfferPriceRules extends DeepCopy<OfferPriceRules> {
    readonly id: number;
    readonly rulesKey: string;
    readonly value: string;
    readonly rule: CompareAction;
    static fromJson(json: object): OfferPriceRules;
    constructor(id?: number, rulesKey?: string, value?: string, rule?: CompareAction);
    toJson(): {
        id: number;
        rulesKey: string;
        value: string;
        rule: string;
    };
    isValid(value: string | undefined): boolean;
    protected deepCopyFromJson(): OfferPriceRules;
    protected getClass(): ClassCreator<OfferPriceRules>;
}
