import { CompareAction } from './CompareAction';
export class OfferPriceRules {
    id: number;
    rulesKey: string;
    value: string;
    rule: CompareAction;
    public static fromJson(data: any): OfferPriceRules {
      const rule: CompareAction = CompareAction[data.rule];
      return new OfferPriceRules(data.id, data.rulesKey, data.value, rule);
  }
    constructor(
        id: number = 0,
        rulesKey: string = '',
        value: string = '',
        rule: CompareAction = CompareAction.EQUALLY
    ) {
          this.id = id;
          this.rulesKey = rulesKey;
          this.value = value;
          this.rule = rule;
    }
    toJson() {
        return {
            id: this.id,
            rulesKey: this.rulesKey,
            value: this.value,
            rule: CompareAction[this.rule].toString()
        };
    }

    isValid(value: string | undefined): boolean {
        if (Number(value) && Number(this.value)) {

            // compare as number
            const externalNumericValue = Number(value);
            const internalNumericValue = Number(this.value);

            switch (this.rule) {
                case CompareAction.EQUALLY:
                    return  externalNumericValue === internalNumericValue;
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
                default: throw new Error('wrong rule');
            }
        } else {
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
                default: throw new Error('wrong rule');
            }
        }
    }
}
