"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OfferSearch_1 = require("./OfferSearch");
var Offer_1 = require("./Offer");
var OfferSearchResultItem = /** @class */ (function () {
    function OfferSearchResultItem(offerSearch, offer) {
        if (offerSearch === void 0) { offerSearch = new OfferSearch_1.default(); }
        if (offer === void 0) { offer = new Offer_1.default(); }
        this.offerSearch = offerSearch;
        this.offer = offer;
    }
    return OfferSearchResultItem;
}());
exports.default = OfferSearchResultItem;
//# sourceMappingURL=OfferSearchResultItem.js.map