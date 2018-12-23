"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SimpleAccount = /** @class */ (function () {
    function SimpleAccount(publicKey, nonce) {
        if (publicKey === void 0) { publicKey = ''; }
        if (nonce === void 0) { nonce = 0; }
        this.publicKey = '';
        this.nonce = 0;
        this.publicKey = publicKey;
        this.nonce = nonce;
    }
    return SimpleAccount;
}());
exports.default = SimpleAccount;
//# sourceMappingURL=SimpleAccount.js.map