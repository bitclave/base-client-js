"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SignedRequest_1 = require("./SignedRequest");
var SignInterceptor = /** @class */ (function () {
    function SignInterceptor(messageSigner) {
        this.messageSigner = messageSigner;
    }
    SignInterceptor.prototype.onIntercept = function (cortege) {
        var _this = this;
        return (cortege.data === null || cortege.data === undefined)
            ? Promise.resolve(cortege)
            : this.messageSigner.signMessage(JSON.stringify(cortege.data))
                .then(function (sigResult) { return new Promise(function (resolve) {
                cortege.data = new SignedRequest_1.default(cortege.data, _this.messageSigner.getPublicKey(), sigResult, 0);
                resolve(cortege);
            }); });
    };
    return SignInterceptor;
}());
exports.default = SignInterceptor;
//# sourceMappingURL=SignInterceptor.js.map