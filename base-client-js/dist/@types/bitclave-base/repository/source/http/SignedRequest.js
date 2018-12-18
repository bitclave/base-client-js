"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SignedRequest = /** @class */ (function () {
    function SignedRequest(data, publicKey, sig, nonce) {
        this.data = data;
        this.pk = publicKey;
        this.sig = sig;
        this.nonce = nonce;
    }
    return SignedRequest;
}());
exports.default = SignedRequest;
//# sourceMappingURL=SignedRequest.js.map