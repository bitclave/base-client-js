import { AccessRight } from '../../utils/keypair/Permissions';
import { ClassCreator, DeepCopy } from './DeepCopy';
import { JsonObject } from './JsonObject';
import { OfferPriceRules } from './OfferPriceRules';

export class OfferPrice extends DeepCopy<OfferPrice> {

    public readonly id: number;
    public readonly description: string;
    public readonly worth: string;
    public readonly rules: Array<OfferPriceRules>;

    public static fromJson(json: object): OfferPrice {
        const raw = json as JsonObject<OfferPrice>;
        raw.rules = (raw.rules as Array<object>).map(item => OfferPriceRules.fromJson(item));

        return Object.assign(new OfferPrice(), raw);
    }

    constructor(
        id: number = 0,
        description: string = '',
        worth: string = '',
        rules: Array<OfferPriceRules> = new Array<OfferPriceRules>()
    ) {
        super();
        this.id = id;
        this.description = description;
        this.worth = worth;
        this.rules = rules;
    }

    public toJson(): object {
        const str = JSON.stringify(this);
        const obj = JSON.parse(str);
        obj.rules = this.rules && this.rules.map(e => e.toJson());

        return obj;
    }

    public isRelevant(data: Map<string, string>): boolean {
        return this.rules && this.rules.length && this.rules.every(priceRule => {
            const value = data.get(priceRule.rulesKey);
            return (value && priceRule.isValid(value)) ? true : false;
        }) ? true : false;
    }

    public getFieldsForAcception(accessRight: AccessRight): Map<string, AccessRight> {
        const fields = new Map<string, AccessRight>();
        if (this.rules && this.rules.length > 0) {
            this.rules.forEach(element => {
                fields.set(element.rulesKey, accessRight);
            });
        }
        return fields;
    }

    protected deepCopyFromJson(): OfferPrice {
        return OfferPrice.fromJson(this.toJson());
    }

    protected getClass(): ClassCreator<OfferPrice> {
        return OfferPrice;
    }
}
