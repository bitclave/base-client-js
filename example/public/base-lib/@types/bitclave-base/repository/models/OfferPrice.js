"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OfferPrice = /** @class */ (function () {
    function OfferPrice(id, description, worth, rules) {
        if (id === void 0) { id = 0; }
        if (description === void 0) { description = ''; }
        if (worth === void 0) { worth = ''; }
        if (rules === void 0) { rules = new Array(); }
        this.id = id;
        this.description = description;
        this.worth = worth;
        this.rules = rules;
    }
    OfferPrice.prototype.toJson = function () {
        var str = JSON.stringify(this);
        var obj = JSON.parse(str);
        obj.rules = this.rules && this.rules.map(function (e) {
            return e.toJson();
        });
        return obj;
    };
    OfferPrice.prototype.isRelevant = function (data) {
        return this.rules && this.rules.length && this.rules.every(function (priceRule) {
            var value = data.get(priceRule.rulesKey);
            return (value && priceRule.isValid(value)) ? true : false;
        }) ? true : false;
    };
    OfferPrice.prototype.getFieldsForAcception = function (accessRight) {
        var fields = new Map();
        if (this.rules && this.rules.length > 0) {
            this.rules.forEach(function (element) {
                fields.set(element.rulesKey, accessRight);
            });
        }
        return fields;
    };
    return OfferPrice;
}());
exports.OfferPrice = OfferPrice;
//# sourceMappingURL=OfferPrice.js.map