"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CompareAction_1 = require("./CompareAction");
var OfferPriceRules = /** @class */ (function () {
    function OfferPriceRules(id, rulesKey, value, rule) {
        if (id === void 0) { id = 0; }
        if (rulesKey === void 0) { rulesKey = ''; }
        if (value === void 0) { value = ''; }
        if (rule === void 0) { rule = CompareAction_1.CompareAction.EQUALLY; }
        this.id = id;
        this.rulesKey = rulesKey;
        this.value = value;
        this.rule = rule;
    }
    OfferPriceRules.fromJson = function (data) {
        var rule;
        switch (data.rule) {
            case 'EQUALLY':
                rule = CompareAction_1.CompareAction.EQUALLY;
                break;
            case 'NOT_EQUAL':
                rule = CompareAction_1.CompareAction.NOT_EQUAL;
                break;
            case 'LESS_OR_EQUAL':
                rule = CompareAction_1.CompareAction.LESS_OR_EQUAL;
                break;
            case 'MORE_OR_EQUAL':
                rule = CompareAction_1.CompareAction.MORE_OR_EQUAL;
                break;
            case 'MORE':
                rule = CompareAction_1.CompareAction.MORE;
                break;
            case 'LESS':
                rule = CompareAction_1.CompareAction.LESS;
                break;
            default: rule = data.rule;
        }
        return new OfferPriceRules(data.id, data.rulesKey, data.value, rule);
    };
    OfferPriceRules.prototype.toJson = function () {
        return {
            id: this.id,
            rulesKey: this.rulesKey,
            value: this.value,
            rule: CompareAction_1.CompareAction[this.rule].toString()
        };
    };
    OfferPriceRules.prototype.isValid = function (value) {
        if (Number(value) && Number(this.value)) {
            // compare as number
            var externalNumericValue = Number(value);
            var internalNumericValue = Number(this.value);
            switch (this.rule) {
                case CompareAction_1.CompareAction.EQUALLY:
                    return externalNumericValue === internalNumericValue;
                case CompareAction_1.CompareAction.LESS:
                    return externalNumericValue < internalNumericValue;
                case CompareAction_1.CompareAction.LESS_OR_EQUAL:
                    return externalNumericValue <= internalNumericValue;
                case CompareAction_1.CompareAction.MORE:
                    return externalNumericValue > internalNumericValue;
                case CompareAction_1.CompareAction.MORE_OR_EQUAL:
                    return externalNumericValue >= internalNumericValue;
                case CompareAction_1.CompareAction.NOT_EQUAL:
                    return externalNumericValue !== internalNumericValue;
                default: throw new Error('wrong rule');
            }
        }
        else if (value) {
            // compare as string
            switch (this.rule) {
                case CompareAction_1.CompareAction.EQUALLY:
                    return value === this.value;
                case CompareAction_1.CompareAction.LESS:
                    return value < this.value;
                case CompareAction_1.CompareAction.LESS_OR_EQUAL:
                    return value <= this.value;
                case CompareAction_1.CompareAction.MORE:
                    return value > this.value;
                case CompareAction_1.CompareAction.MORE_OR_EQUAL:
                    return value >= this.value;
                case CompareAction_1.CompareAction.NOT_EQUAL:
                    return value !== this.value;
                default: throw new Error('wrong rule');
            }
        }
        else {
            // value is undefined
            return false;
        }
    };
    return OfferPriceRules;
}());
exports.OfferPriceRules = OfferPriceRules;
//# sourceMappingURL=OfferPriceRules.js.map