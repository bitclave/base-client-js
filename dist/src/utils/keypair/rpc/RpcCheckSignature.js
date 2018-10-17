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
var RpcCheckSignature = /** @class */ (function (_super) {
    __extends(RpcCheckSignature, _super);
    function RpcCheckSignature(msg, sig, accessToken) {
        if (msg === void 0) { msg = ''; }
        if (sig === void 0) { sig = ''; }
        if (accessToken === void 0) { accessToken = ''; }
        var _this = _super.call(this, accessToken) || this;
        _this.msg = msg;
        _this.sig = sig;
        return _this;
    }
    return RpcCheckSignature;
}(RpcToken_1.RpcToken));
exports.default = RpcCheckSignature;
//# sourceMappingURL=RpcCheckSignature.js.map