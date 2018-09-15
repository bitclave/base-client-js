import { CompareAction } from './CompareAction';
export class OfferPriceRules {
    id: number;
    rulesKey: string;
    value: string;
    rule: CompareAction;
    public static fromJson(data: any): OfferPriceRules {
      let rule: CompareAction;
      switch (data.rule) {
<<<<<<< HEAD
=======
        case CompareAction.NOT_EQUAL: rule = CompareAction.NOT_EQUAL; break;
        case CompareAction.LESS_OR_EQUAL: rule = CompareAction.LESS_OR_EQUAL; break;
        case CompareAction.MORE_OR_EQUAL: rule = CompareAction.MORE_OR_EQUAL; break;
        case CompareAction.MORE: rule = CompareAction.MORE; break;
        case CompareAction.LESS: rule = CompareAction.LESS; break;

>>>>>>> ed320b5036a5ba36a96ef14c3c3ebc91a2b5941f
        case 'EQUALLY': rule = CompareAction.EQUALLY; break;
        case 'NOT_EQUAL': rule = CompareAction.NOT_EQUAL; break;
        case 'LESS_OR_EQUAL': rule = CompareAction.LESS_OR_EQUAL; break;
        case 'MORE_OR_EQUAL': rule = CompareAction.MORE_OR_EQUAL; break;
        case 'MORE': rule = CompareAction.MORE; break;
        case 'LESS': rule = CompareAction.LESS; break;
<<<<<<< HEAD
        default: throw new Error(`wrong compare action: ${data.rule}`);
=======

        default: rule = CompareAction.EQUALLY; break;
>>>>>>> ed320b5036a5ba36a96ef14c3c3ebc91a2b5941f
      }
      return new OfferPriceRules(data.id, data.rulesKey, data.value, rule);
      return new OfferPriceRules(data.id, data.rulesKey, data.value, data.rule);
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
                default: throw new Error('wrong rule');
            }
        } else {
          // value is undefined
          return false;
        }
    }
}
