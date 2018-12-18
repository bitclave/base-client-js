"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OfferSearch = /** @class */ (function () {
    function OfferSearch(searchRequestId, offerId) {
        if (searchRequestId === void 0) { searchRequestId = 0; }
        if (offerId === void 0) { offerId = 0; }
        this.id = 0;
        this.searchRequestId = 0;
        this.offerId = 0;
        this.state = OfferResultAction.NONE;
        this.searchRequestId = searchRequestId;
        this.offerId = offerId;
    }
    return OfferSearch;
}());
exports.default = OfferSearch;
var OfferResultAction;
(function (OfferResultAction) {
    OfferResultAction["NONE"] = "NONE";
    OfferResultAction["ACCEPT"] = "ACCEPT";
    OfferResultAction["REJECT"] = "REJECT";
})(OfferResultAction = exports.OfferResultAction || (exports.OfferResultAction = {}));
//# sourceMappingURL=OfferSearch.js.map