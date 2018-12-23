"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Offer_1 = require("../models/Offer");
var HttpMethod_1 = require("../source/http/HttpMethod");
var OfferRepositoryImpl = /** @class */ (function () {
    function OfferRepositoryImpl(transport) {
        this.OFFER_API = '/v1/client/{owner}/offer/{id}';
        this.transport = transport;
    }
    OfferRepositoryImpl.prototype.create = function (owner, offer) {
        return this.transport.sendRequest(this.OFFER_API.replace('{owner}', owner).replace('{id}', ''), HttpMethod_1.HttpMethod.Put, offer.toJson()).then(function (response) { return Offer_1.default.fromJson(response.json); });
    };
    OfferRepositoryImpl.prototype.update = function (owner, id, offer) {
        return this.transport.sendRequest(this.OFFER_API.replace('{owner}', owner).replace('{id}', id.toString()), HttpMethod_1.HttpMethod.Put, offer.toJson()).then(function (response) { return Offer_1.default.fromJson(response.json); });
    };
    OfferRepositoryImpl.prototype.deleteById = function (owner, id) {
        return this.transport.sendRequest(this.OFFER_API.replace('{owner}', owner).replace('{id}', id.toString()), HttpMethod_1.HttpMethod.Delete, id).then(function (response) { return parseInt(response.json.toString(), 10); });
    };
    OfferRepositoryImpl.prototype.getOfferByOwnerAndId = function (owner, id) {
        var _this = this;
        return this.transport.sendRequest(this.OFFER_API.replace('{owner}', owner).replace('{id}', id.toString()), HttpMethod_1.HttpMethod.Get).then(function (response) { return _this.jsonToListOffers(response.json); });
    };
    OfferRepositoryImpl.prototype.getOfferByOwner = function (owner) {
        var _this = this;
        return this.transport.sendRequest(this.OFFER_API.replace('{owner}', owner).replace('{id}', ''), HttpMethod_1.HttpMethod.Get).then(function (response) { return _this.jsonToListOffers(response.json); });
    };
    OfferRepositoryImpl.prototype.getAllOffer = function () {
        var _this = this;
        return this.transport.sendRequest(this.OFFER_API.replace('{owner}', '0x0').replace('{id}', ''), HttpMethod_1.HttpMethod.Get).then(function (response) { return _this.jsonToListOffers(response.json); });
    };
    OfferRepositoryImpl.prototype.jsonToListOffers = function (json) {
        var e_1, _a;
        var result = [];
        try {
            for (var json_1 = __values(json), json_1_1 = json_1.next(); !json_1_1.done; json_1_1 = json_1.next()) {
                var item = json_1_1.value;
                result.push(Offer_1.default.fromJson(item));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (json_1_1 && !json_1_1.done && (_a = json_1.return)) _a.call(json_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    };
    return OfferRepositoryImpl;
}());
exports.default = OfferRepositoryImpl;
//# sourceMappingURL=OfferRepositoryImpl.js.map