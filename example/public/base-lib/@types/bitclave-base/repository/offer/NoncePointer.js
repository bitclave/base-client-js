"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NoncePointer = /** @class */ (function () {
    function NoncePointer(nonce, transactionKey) {
        this.nonce = nonce;
        this.transactionKey = transactionKey;
    }
    NoncePointer.generateKey = function (uid, spid) {
        return uid + NoncePointer.SEP + spid;
    };
    NoncePointer.getUID = function (key) {
        return key.split(this.SEP)[0];
    };
    NoncePointer.getSPID = function (key) {
        return key.split(this.SEP)[1];
    };
    NoncePointer.SEP = '_';
    return NoncePointer;
}());
exports.default = NoncePointer;
//# sourceMappingURL=NoncePointer.js.map