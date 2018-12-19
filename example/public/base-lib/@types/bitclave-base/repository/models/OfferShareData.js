"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OfferShareData = /** @class */ (function () {
    function OfferShareData(offerSearchId, clientResponse, priceId) {
        this.offerSearchId = 0;
        this.offerOwner = '0x0';
        this.clientId = '0x0';
        this.clientResponse = '';
        this.worth = '0';
        this.accepted = false;
        this.offerSearchId = offerSearchId;
        this.clientResponse = clientResponse;
        this.priceId = priceId;
    }
    return OfferShareData;
}());
exports.default = OfferShareData;
//# sourceMappingURL=OfferShareData.js.map