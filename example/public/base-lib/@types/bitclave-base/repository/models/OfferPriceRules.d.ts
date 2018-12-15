import { CompareAction } from './CompareAction';
export declare class OfferPriceRules {
    id: number;
    rulesKey: string;
    value: string;
    rule: CompareAction;
    static fromJson(data: any): OfferPriceRules;
    constructor(id?: number, rulesKey?: string, value?: string, rule?: CompareAction);
    toJson(): {
        id: number;
        rulesKey: string;
        value: string;
        rule: string;
    };
    isValid(value: string | undefined): boolean;
}
