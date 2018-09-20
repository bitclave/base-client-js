"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RpcToken = /** @class */ (function () {
    function RpcToken(accessToken) {
        this.accessToken = accessToken;
    }
    RpcToken.prototype.getAccessTokenSig = function () {
        return this.accessToken.substring(32);
    };
    RpcToken.prototype.getClearAccessToken = function () {
        return this.accessToken.substring(0, 32);
    };
    return RpcToken;
}());
exports.RpcToken = RpcToken;
//# sourceMappingURL=RpcToken.js.map