"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CompareAction_1 = require("./CompareAction");
var OfferPrice_1 = require("./OfferPrice");
var OfferPriceRules_1 = require("./OfferPriceRules");
var JsonUtils_1 = require("../../utils/JsonUtils");
var Offer = /** @class */ (function () {
    function Offer(description, title, imageUrl, worth, tags, compare, rules, offerPrices) {
        if (description === void 0) { description = ''; }
        if (title === void 0) { title = ''; }
        if (imageUrl === void 0) { imageUrl = ''; }
        if (worth === void 0) { worth = '0'; }
        if (tags === void 0) { tags = new Map(); }
        if (compare === void 0) { compare = new Map(); }
        if (rules === void 0) { rules = new Map(); }
        if (offerPrices === void 0) { offerPrices = new Array(); }
        this.id = 0;
        this.owner = '0x0';
        this.offerPrices = new Array();
        this.description = description;
        this.title = title;
        this.imageUrl = imageUrl;
        this.worth = worth;
        this.tags = tags;
        this.compare = compare;
        this.rules = rules;
        this.offerPrices = offerPrices;
        if (this.offerPrices.length == 0 && this.compare.size > 0) {
            var key = Array.from(compare.keys())[0];
            var val = compare.get(key) || "";
            this.offerPrices = [
                new OfferPrice_1.OfferPrice(0, "default", worth, [
                    new OfferPriceRules_1.OfferPriceRules(0, key.toString(), val.toString(), rules[0])
                ])
            ];
        }
    }
    Offer.fromJson = function (json) {
        var offer = Object.assign(new Offer(), json);
        offer.tags = JsonUtils_1.JsonUtils.jsonToMap(json.tags);
        offer.compare = JsonUtils_1.JsonUtils.jsonToMap(json.compare);
        offer.rules = JsonUtils_1.JsonUtils.jsonToMap(json.rules);
        if (json.offerPrices && json.offerPrices.length) {
            offer.offerPrices = json.offerPrices.map(function (e) {
                var offerRules = e.rules && e.rules.length
                    ? e.rules.map(function (r) { return OfferPriceRules_1.OfferPriceRules.fromJson(r); })
                    : Array();
                return new OfferPrice_1.OfferPrice(e.id, e.description, e.worth, offerRules);
            });
        }
        else {
            if (offer.compare.size > 0) {
                var key = Array.from(offer.compare.keys())[0];
                var val = offer.compare.get(key) || "";
                offer.offerPrices = [
                    new OfferPrice_1.OfferPrice(0, "default", offer.worth, [
                        new OfferPriceRules_1.OfferPriceRules(0, key.toString(), val.toString(), offer.rules[0])
                    ])
                ];
            }
        }
        return offer;
    };
    Offer.prototype.toJson = function () {
        var jsonStr = JSON.stringify(this);
        var json = JSON.parse(jsonStr);
        json.tags = JsonUtils_1.JsonUtils.mapToJson(this.tags);
        json.compare = JsonUtils_1.JsonUtils.mapToJson(this.compare);
        json.rules = JsonUtils_1.JsonUtils.mapToJson(this.rules);
        for (var item in json.rules) {
            if (typeof json.rules[item] === 'number') {
                json.rules[item] = CompareAction_1.CompareAction[json.rules[item]].toString();
            }
        }
        json.offerPrices = this.offerPrices.map(function (e) {
            return e.toJson();
        });
        return json;
    };
    Offer.prototype.validPrices = function (data) {
        var mostRelevantPrice = this.offerPrices.filter(function (price) { return price.isRelevant(data); });
        return mostRelevantPrice;
    };
    Offer.prototype.getPriceById = function (id) {
        if (this.offerPrices && this.offerPrices.length > 0) {
            var price = this.offerPrices.find(function (p) {
                return p.id === id;
            });
            return price;
        }
        else {
            return undefined;
        }
    };
    return Offer;
}());
exports.default = Offer;
//# sourceMappingURL=Offer.js.map