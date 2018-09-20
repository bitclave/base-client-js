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
var SimpleAccount_1 = require("./SimpleAccount");
var Account = /** @class */ (function (_super) {
    __extends(Account, _super);
    function Account(publicKey, nonce) {
        if (publicKey === void 0) { publicKey = ''; }
        if (nonce === void 0) { nonce = 0; }
        var _this = _super.call(this, publicKey, nonce) || this;
        _this.message = '';
        _this.sig = '';
        return _this;
    }
    Account.prototype.toSimpleAccount = function () {
        return new SimpleAccount_1.default(this.publicKey, this.nonce);
    };
    return Account;
}(SimpleAccount_1.default));
exports.default = Account;
//# sourceMappingURL=Account.js.map