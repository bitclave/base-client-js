"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sigUtil = require('eth-sig-util');
var EthereumUtils = /** @class */ (function () {
    function EthereumUtils() {
    }
    EthereumUtils.recoverPersonalSignature = function (data) {
        return sigUtil.recoverPersonalSignature(data);
    };
    EthereumUtils.createSig = function (privateKey, data) {
        return sigUtil.personalSign(Buffer.from(privateKey, 'hex'), data);
    };
    return EthereumUtils;
}());
exports.EthereumUtils = EthereumUtils;
//# sourceMappingURL=EthereumUtils.js.map