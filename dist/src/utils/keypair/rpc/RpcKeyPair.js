"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RpcClientData_1 = require("./RpcClientData");
var KeyPair_1 = require("../KeyPair");
var RpcSignMessage_1 = require("./RpcSignMessage");
var RpcEncryptMessage_1 = require("./RpcEncryptMessage");
var RpcDecryptMessage_1 = require("./RpcDecryptMessage");
var RpcCheckSignature_1 = require("./RpcCheckSignature");
var RpcToken_1 = require("./RpcToken");
var RpcDecryptEncryptFields_1 = require("./RpcDecryptEncryptFields");
var RpcPermissionsFields_1 = require("./RpcPermissionsFields");
var JsonUtils_1 = require("../../JsonUtils");
var Mnemonic = require('bitcore-mnemonic');
var RpcKeyPair = /** @class */ (function () {
    function RpcKeyPair(rpcTransport) {
        this.accessToken = '';
        this.rpcTransport = rpcTransport;
    }
    RpcKeyPair.prototype.createKeyPair = function (passPhrase) {
        var _this = this;
        return this.rpcTransport.request('checkAccessToken', new RpcToken_1.RpcToken(this.accessToken))
            .then(function (response) { return _this.clientData = Object.assign(new RpcClientData_1.default(), response); })
            .then(function (response) { return new KeyPair_1.KeyPair('', response.publicKey); });
    };
    RpcKeyPair.prototype.generateMnemonicPhrase = function () {
        return new Promise(function (resolve) {
            var mnemonic = new Mnemonic(Mnemonic.Words.ENGLISH).toString();
            resolve(mnemonic);
        });
    };
    RpcKeyPair.prototype.signMessage = function (data) {
        return this.rpcTransport.request('signMessage', new RpcSignMessage_1.default(data, this.clientData.accessToken));
    };
    RpcKeyPair.prototype.checkSig = function (data, sig) {
        return this.rpcTransport.request('checkSig', new RpcCheckSignature_1.default(data, sig, this.clientData.accessToken));
    };
    RpcKeyPair.prototype.getPublicKey = function () {
        return this.clientData.publicKey;
    };
    RpcKeyPair.prototype.encryptMessage = function (recipientPk, message) {
        return this.rpcTransport.request('encryptMessage', new RpcEncryptMessage_1.default(this.clientData.accessToken, recipientPk, message));
    };
    RpcKeyPair.prototype.encryptFields = function (fields) {
        return this.rpcTransport.request('encryptFields', new RpcDecryptEncryptFields_1.default(this.clientData.accessToken, JsonUtils_1.JsonUtils.mapToJson(fields))).then(function (response) { return JsonUtils_1.JsonUtils.jsonToMap(response); });
    };
    RpcKeyPair.prototype.encryptPermissionsFields = function (recipient, data) {
        return this.rpcTransport.request('encryptPermissionsFields', new RpcPermissionsFields_1.default(this.clientData.accessToken, recipient, JsonUtils_1.JsonUtils.mapToJson(data)));
    };
    RpcKeyPair.prototype.decryptMessage = function (senderPk, encrypted) {
        return this.rpcTransport.request('decryptMessage', new RpcDecryptMessage_1.default(this.clientData.accessToken, senderPk, encrypted));
    };
    RpcKeyPair.prototype.decryptFields = function (fields) {
        return this.rpcTransport.request('decryptFields', new RpcDecryptEncryptFields_1.default(this.clientData.accessToken, JsonUtils_1.JsonUtils.mapToJson(fields))).then(function (response) { return JsonUtils_1.JsonUtils.jsonToMap(response); });
    };
    RpcKeyPair.prototype.setAccessToken = function (accessToken) {
        this.accessToken = accessToken;
    };
    RpcKeyPair.prototype.getAccessToken = function () {
        return this.accessToken;
    };
    return RpcKeyPair;
}());
exports.RpcKeyPair = RpcKeyPair;
//# sourceMappingURL=RpcKeyPair.js.map