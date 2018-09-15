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
var RpcAccessData_1 = require("./RpcAccessData");
var Permissions_1 = require("../Permissions");
var ClientData = /** @class */ (function (_super) {
    __extends(ClientData, _super);
    function ClientData(publicKey, accessToken, origin, expireDate, permissions) {
        if (publicKey === void 0) { publicKey = ''; }
        if (accessToken === void 0) { accessToken = ''; }
        if (origin === void 0) { origin = ''; }
        if (expireDate === void 0) { expireDate = ''; }
        if (permissions === void 0) { permissions = new Permissions_1.Permissions(); }
        var _this = _super.call(this, accessToken, origin, expireDate, permissions) || this;
        _this.publicKey = publicKey;
        return _this;
    }
    return ClientData;
}(RpcAccessData_1.default));
exports.default = ClientData;
//# sourceMappingURL=RpcClientData.js.map