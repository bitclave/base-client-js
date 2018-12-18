"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var RpcToken_1 = require("./RpcToken");
var RpcAuth = /** @class */ (function (_super) {
    __extends(RpcAuth, _super);
    function RpcAuth(accessToken, passPhrase, origin, expireDate) {
        if (accessToken === void 0) { accessToken = ''; }
        if (passPhrase === void 0) { passPhrase = ''; }
        if (origin === void 0) { origin = ''; }
        if (expireDate === void 0) { expireDate = ''; }
        var _this = _super.call(this, accessToken) || this;
        _this.passPhrase = passPhrase;
        _this.origin = origin;
        _this.expireDate = expireDate;
        return _this;
    }
    return RpcAuth;
}(RpcToken_1.RpcToken));
exports.RpcAuth = RpcAuth;
//# sourceMappingURL=RpcAuth.js.map