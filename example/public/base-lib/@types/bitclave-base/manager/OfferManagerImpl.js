"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Account_1 = require("../repository/models/Account");
var OfferManagerImpl = /** @class */ (function () {
    function OfferManagerImpl(offerRepository, authAccountBehavior) {
        this.account = new Account_1.default();
        this.offerRepository = offerRepository;
        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));
    }
    OfferManagerImpl.prototype.saveOffer = function (offer) {
        var offerId = offer.id;
        if (offerId <= 0) {
            return this.offerRepository.create(this.account.publicKey, offer);
        }
        else {
            return this.offerRepository.update(this.account.publicKey, offerId, offer);
        }
    };
    OfferManagerImpl.prototype.getMyOffers = function (id) {
        if (id === void 0) { id = 0; }
        if (id > 0) {
            return this.offerRepository.getOfferByOwnerAndId(this.account.publicKey, id);
        }
        else {
            return this.offerRepository.getOfferByOwner(this.account.publicKey);
        }
    };
    OfferManagerImpl.prototype.getAllOffers = function () {
        return this.offerRepository.getAllOffer();
    };
    OfferManagerImpl.prototype.deleteOffer = function (id) {
        return this.offerRepository.deleteById(this.account.publicKey, id);
    };
    OfferManagerImpl.prototype.onChangeAccount = function (account) {
        this.account = account;
    };
    return OfferManagerImpl;
}());
exports.OfferManagerImpl = OfferManagerImpl;
//# sourceMappingURL=OfferManagerImpl.js.map