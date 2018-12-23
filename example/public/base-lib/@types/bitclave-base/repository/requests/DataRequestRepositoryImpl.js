"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataRequest_1 = require("../models/DataRequest");
var HttpMethod_1 = require("../source/http/HttpMethod");
var OfferShareData_1 = require("../models/OfferShareData");
var DataRequestRepositoryImpl = /** @class */ (function () {
    function DataRequestRepositoryImpl(transport) {
        this.DATA_REQUEST = '/v1/data/request/';
        this.GRANT_ACCESS_FOR_CLIENT = '/v1/data/grant/request/';
        this.GRANT_ACCESS_FOR_OFFER = '/v1/data/grant/offer/';
        this.transport = transport;
    }
    DataRequestRepositoryImpl.prototype.requestPermissions = function (toPk, encryptedRequest) {
        var data = new DataRequest_1.default(toPk, encryptedRequest);
        return this.transport
            .sendRequest(this.DATA_REQUEST, HttpMethod_1.HttpMethod.Post, data).then(function (response) { return parseInt(response.json.toString(), 10); });
    };
    DataRequestRepositoryImpl.prototype.grantAccessForClient = function (fromPk, toPk, encryptedResponse) {
        var data = new DataRequest_1.default(toPk, '');
        data.responseData = encryptedResponse;
        data.fromPk = fromPk;
        return this.transport
            .sendRequest(this.GRANT_ACCESS_FOR_CLIENT, HttpMethod_1.HttpMethod.Post, data).then(function (response) { return parseInt(response.json.toString(), 10); });
    };
    DataRequestRepositoryImpl.prototype.getRequests = function (fromPk, toPk) {
        var params = new Map([
            ['toPk', toPk],
            ['fromPk', fromPk]
        ]);
        var strParams = this.joinParams(params);
        return this.transport
            .sendRequest(this.DATA_REQUEST + ("?" + strParams), HttpMethod_1.HttpMethod.Get).then(function (response) { return Object.assign([], response.json); });
    };
    DataRequestRepositoryImpl.prototype.grantAccessForOffer = function (offerSearchId, clientPk, encryptedClientResponse, priceId) {
        var shareData = new OfferShareData_1.default(offerSearchId, encryptedClientResponse, priceId);
        return this.transport
            .sendRequest(this.GRANT_ACCESS_FOR_OFFER, HttpMethod_1.HttpMethod.Post, shareData);
    };
    DataRequestRepositoryImpl.prototype.joinParams = function (params) {
        var _this = this;
        var result = [];
        params.forEach(function (value, key) {
            if (!_this.isEmpty(value)) {
                result.push(key + "=" + value);
            }
        });
        return result.join('&');
    };
    DataRequestRepositoryImpl.prototype.isEmpty = function (value) {
        return value == null || value === undefined || value.trim().length === 0;
    };
    return DataRequestRepositoryImpl;
}());
exports.default = DataRequestRepositoryImpl;
//# sourceMappingURL=DataRequestRepositoryImpl.js.map