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
var Permissions_1 = require("../Permissions");
var RpcToken_1 = require("./RpcToken");
var AccessData = /** @class */ (function (_super) {
    __extends(AccessData, _super);
    function AccessData(accessToken, origin, expireDate, permissions) {
        if (accessToken === void 0) { accessToken = ''; }
        if (origin === void 0) { origin = ''; }
        if (expireDate === void 0) { expireDate = ''; }
        if (permissions === void 0) { permissions = new Permissions_1.Permissions(); }
        var _this = _super.call(this, accessToken) || this;
        _this.origin = origin;
        _this.expireDate = expireDate;
        _this.permissions = permissions;
        return _this;
    }
    return AccessData;
}(RpcToken_1.RpcToken));
exports.default = AccessData;
//# sourceMappingURL=RpcAccessData.js.map