"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SignedRequest_1 = require("./SignedRequest");
var NonceInterceptor = /** @class */ (function () {
    function NonceInterceptor(messageSigner, nonceSource) {
        this.messageSigner = messageSigner;
        this.nonceSource = nonceSource;
    }
    NonceInterceptor.prototype.onIntercept = function (cortege) {
        return !(cortege.data instanceof SignedRequest_1.default) && !cortege.isTransaction()
            ? Promise.resolve(cortege)
            : this.nonceSource.getNonce(this.messageSigner.getPublicKey())
                .then(function (nonce) {
                cortege.data.nonce = ++nonce;
                return cortege;
            });
    };
    return NonceInterceptor;
}());
exports.default = NonceInterceptor;
//# sourceMappingURL=NonceInterceptor.js.map