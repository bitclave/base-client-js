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
var RpcPermissionsFields = /** @class */ (function (_super) {
    __extends(RpcPermissionsFields, _super);
    function RpcPermissionsFields(accessToken, recipient, data) {
        var _this = _super.call(this, accessToken) || this;
        _this.recipient = recipient;
        _this.data = data;
        return _this;
    }
    return RpcPermissionsFields;
}(RpcToken_1.RpcToken));
exports.default = RpcPermissionsFields;
//# sourceMappingURL=RpcPermissionsFields.js.map