"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Profile = /** @class */ (function () {
    function Profile(data, account) {
        this._data = data;
        this._account = account;
    }
    Object.defineProperty(Profile.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Profile.prototype, "account", {
        get: function () {
            return this._account;
        },
        enumerable: true,
        configurable: true
    });
    return Profile;
}());
exports.default = Profile;
//# sourceMappingURL=Profile.js.map