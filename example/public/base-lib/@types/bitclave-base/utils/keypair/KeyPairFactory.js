"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BitKeyPair_1 = require("./BitKeyPair");
var RpcKeyPair_1 = require("./rpc/RpcKeyPair");
var KeyPairFactory = /** @class */ (function () {
    function KeyPairFactory() {
    }
    KeyPairFactory.createDefaultKeyPair = function (permissionsSource, siteDataSource, origin) {
        return new BitKeyPair_1.BitKeyPair(permissionsSource, siteDataSource, origin);
    };
    KeyPairFactory.createRpcKeyPair = function (rpcTransport) {
        return new RpcKeyPair_1.RpcKeyPair(rpcTransport);
    };
    return KeyPairFactory;
}());
exports.KeyPairFactory = KeyPairFactory;
//# sourceMappingURL=KeyPairFactory.js.map