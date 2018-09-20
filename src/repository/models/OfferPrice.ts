import { OfferPriceRules } from './OfferPriceRules';
import { AccessRight } from '../../Base';
export class OfferPrice {

    id: number;
    description: string;
    worth: string;
    rules: Array<OfferPriceRules>;

    constructor(
      id: number = 0,
      description: string = '',
      worth: string = '',
      rules: Array<OfferPriceRules> = new Array<OfferPriceRules>()
    ) {
        this.id = id;
        this.description = description;
        this.worth = worth;
        this.rules = rules;
    }
    toJson() {
        const str = JSON.stringify(this);
        const obj = JSON.parse(str);
        obj.rules = this.rules && this.rules.map( e =>
            e.toJson()
        );
        return obj;
    }
    isRelevant(data: Map<string, string>): boolean {
        return this.rules && this.rules.length && this.rules.every( priceRule => {
            const value = data.get(priceRule.rulesKey);
            return (value && priceRule.isValid(value)) ? true : false;
        }) ? true : false;
    }
    getFieldsForAcception(accessRight: AccessRight): Map<string, AccessRight> {
        const fields = new Map<string, AccessRight>();
        if (this.rules && this.rules.length > 0) {
            this.rules.forEach(element => {
                fields.set(element.rulesKey, accessRight);
            });
        }
        return fields;
    }
}
