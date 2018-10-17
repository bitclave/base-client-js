"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAddrPair = /** @class */ (function () {
    function BaseAddrPair(baseID, ethAddr) {
        this.baseID = baseID;
        this.ethAddr = ethAddr;
    }
    return BaseAddrPair;
}());
exports.BaseAddrPair = BaseAddrPair;
var AddrRecord = /** @class */ (function () {
    function AddrRecord(data, sig) {
        this.data = data || '';
        this.sig = sig || '';
    }
    return AddrRecord;
}());
exports.AddrRecord = AddrRecord;
var WalletsRecords = /** @class */ (function () {
    function WalletsRecords(data, sig) {
        this.data = data;
        this.sig = sig;
    }
    return WalletsRecords;
}());
exports.WalletsRecords = WalletsRecords;
var WealthRecord = /** @class */ (function () {
    function WealthRecord(wealth, sig) {
        this.wealth = wealth;
        this.sig = sig;
    }
    return WealthRecord;
}());
exports.WealthRecord = WealthRecord;
var WealthPtr = /** @class */ (function () {
    function WealthPtr(validator, decryptKey) {
        this.validator = validator || '';
        this.decryptKey = decryptKey || '';
    }
    return WealthPtr;
}());
exports.WealthPtr = WealthPtr;
var ProfileUser = /** @class */ (function () {
    function ProfileUser() {
    }
    return ProfileUser;
}());
exports.ProfileUser = ProfileUser;
var ProfileWealthValidator = /** @class */ (function () {
    function ProfileWealthValidator() {
    }
    return ProfileWealthValidator;
}());
exports.ProfileWealthValidator = ProfileWealthValidator;
//# sourceMappingURL=BaseTypes.js.map