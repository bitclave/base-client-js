"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KeyPair = /** @class */ (function () {
    function KeyPair(privateKey, publicKey) {
        this._privateKey = privateKey;
        this._publicKey = publicKey;
    }
    Object.defineProperty(KeyPair.prototype, "privateKey", {
        get: function () {
            return this._privateKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyPair.prototype, "publicKey", {
        get: function () {
            return this._publicKey;
        },
        enumerable: true,
        configurable: true
    });
    return KeyPair;
}());
exports.KeyPair = KeyPair;
//# sourceMappingURL=KeyPair.js.map