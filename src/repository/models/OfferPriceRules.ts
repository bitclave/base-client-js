import { CompareAction } from './CompareAction';
import { DeepCopy } from './ObjectClone';

export class OfferPriceRules extends DeepCopy<OfferPriceRules> {
    public readonly id: number;
    public readonly rulesKey: string;
    public readonly value: string;
    public readonly rule: CompareAction;

    public static fromJson(json: object): OfferPriceRules {
        const raw = json as JsonObject<OfferPriceRules>;
        const strRule: string = (raw.rule || CompareAction.EQUALLY).toString();
        const rule: CompareAction = CompareAction[strRule] || CompareAction.EQUALLY;

        return new OfferPriceRules(raw.id as number, raw.rulesKey as string, raw.value as string, rule);
    }

    constructor(
        id: number = 0,
        rulesKey: string = '',
        value: string = '',
        rule: CompareAction = CompareAction.EQUALLY
    ) {
        super();
        this.id = id;
        this.rulesKey = rulesKey;
        this.value = value;
        this.rule = rule;
    }

    public toJson() {
        return {
            id: this.id,
            rulesKey: this.rulesKey,
            value: this.value,
            rule: CompareAction[this.rule].toString()
        };
    }

    public isValid(value: string | undefined): boolean {
        if (Number(value) && Number(this.value)) {

            // compare as number
            const externalNumericValue = Number(value);
            const internalNumericValue = Number(this.value);

            switch (this.rule) {
                case CompareAction.EQUALLY:
                    return externalNumericValue === internalNumericValue;
                case CompareAction.LESS:
                    return externalNumericValue < internalNumericValue;
                case CompareAction.LESS_OR_EQUAL:
                    return externalNumericValue <= internalNumericValue;
                case CompareAction.MORE:
                    return externalNumericValue > internalNumericValue;
                case CompareAction.MORE_OR_EQUAL:
                    return externalNumericValue >= internalNumericValue;
                case CompareAction.NOT_EQUAL:
                    return externalNumericValue !== internalNumericValue;
                default:
                    throw new Error('wrong rule');
            }
        } else if (value) {
            // compare as string
            switch (this.rule) {
                case CompareAction.EQUALLY:
                    return value === this.value;
                case CompareAction.LESS:
                    return value < this.value;
                case CompareAction.LESS_OR_EQUAL:
                    return value <= this.value;
                case CompareAction.MORE:
                    return value > this.value;
                case CompareAction.MORE_OR_EQUAL:
                    return value >= this.value;
                case CompareAction.NOT_EQUAL:
                    return value !== this.value;
                default:
                    throw new Error('wrong rule');
            }
        } else {
            // value is undefined
            return false;
        }
    }

    protected deepCopyFromJson(): OfferPriceRules {
        return OfferPriceRules.fromJson(this.toJson());
    }
}
