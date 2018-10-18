"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpMethod_1 = require("../source/http/HttpMethod");
var Account_1 = require("../models/Account");
var AccountRepositoryImpl = /** @class */ (function () {
    function AccountRepositoryImpl(transport) {
        this.SIGN_UP = '/v1/registration';
        this.SIGN_IN = '/v1/exist';
        this.DELETE = '/v1/delete';
        this.GET_NONCE = '/v1/nonce/';
        this.transport = transport;
    }
    AccountRepositoryImpl.prototype.registration = function (account) {
        return this.transport
            .sendRequest(this.SIGN_UP, HttpMethod_1.HttpMethod.Post, account.toSimpleAccount())
            .then(function (response) { return Object.assign(new Account_1.default(), response.json); });
    };
    AccountRepositoryImpl.prototype.checkAccount = function (account) {
        return this.transport
            .sendRequest(this.SIGN_IN, HttpMethod_1.HttpMethod.Post, account.toSimpleAccount())
            .then(function (response) { return Object.assign(new Account_1.default(), response.json); });
    };
    AccountRepositoryImpl.prototype.unsubscribe = function (account) {
        return this.transport
            .sendRequest(this.DELETE, HttpMethod_1.HttpMethod.Delete, account.toSimpleAccount())
            .then(function (response) { return Object.assign(new Account_1.default(), response.json); });
    };
    AccountRepositoryImpl.prototype.getNonce = function (account) {
        return this.transport
            .sendRequest(this.GET_NONCE + account.publicKey, HttpMethod_1.HttpMethod.Get)
            .then(function (response) { return parseInt(response.json.toString(), 10); });
    };
    return AccountRepositoryImpl;
}());
exports.default = AccountRepositoryImpl;
//# sourceMappingURL=AccountRepositoryImpl.js.map