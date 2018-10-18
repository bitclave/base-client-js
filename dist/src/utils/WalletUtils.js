"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSchema_1 = require("./types/BaseSchema");
var BaseTypes_1 = require("./types/BaseTypes");
var EthereumUtils_1 = require("./EthereumUtils");
var WalletManagerImpl_1 = require("../manager/WalletManagerImpl");
var bitcore = require('bitcore-lib');
var Message = require('bitcore-message');
var WalletVerificationCodes;
(function (WalletVerificationCodes) {
    WalletVerificationCodes[WalletVerificationCodes["RC_OK"] = 0] = "RC_OK";
    WalletVerificationCodes[WalletVerificationCodes["RC_BASEID_MISSMATCH"] = -1] = "RC_BASEID_MISSMATCH";
    WalletVerificationCodes[WalletVerificationCodes["RC_ADDR_NOT_VERIFIED"] = -2] = "RC_ADDR_NOT_VERIFIED";
    WalletVerificationCodes[WalletVerificationCodes["RC_ADDR_WRONG_SIGNATURE"] = -3] = "RC_ADDR_WRONG_SIGNATURE";
    WalletVerificationCodes[WalletVerificationCodes["RC_ADDR_SCHEMA_MISSMATCH"] = -4] = "RC_ADDR_SCHEMA_MISSMATCH";
    WalletVerificationCodes[WalletVerificationCodes["RC_GENERAL_ERROR"] = -100] = "RC_GENERAL_ERROR";
})(WalletVerificationCodes = exports.WalletVerificationCodes || (exports.WalletVerificationCodes = {}));
var WalletVerificationStatus = /** @class */ (function () {
    function WalletVerificationStatus() {
        this.rc = WalletVerificationCodes.RC_OK;
        this.err = '';
        this.details = [];
    }
    return WalletVerificationStatus;
}());
exports.WalletVerificationStatus = WalletVerificationStatus;
var WalletUtils = /** @class */ (function () {
    function WalletUtils() {
    }
    WalletUtils.verifyAddressRecord = function (record) {
        var signerAddr;
        try {
            if (!this.baseSchema.validateAddr(record)) {
                return WalletVerificationCodes.RC_ADDR_SCHEMA_MISSMATCH;
            }
            if (!this.baseSchema.validateBaseAddrPair(JSON.parse(record.data))) {
                return WalletVerificationCodes.RC_ADDR_SCHEMA_MISSMATCH;
            }
            if (record.sig.length > 0) {
                signerAddr = EthereumUtils_1.EthereumUtils.recoverPersonalSignature(record);
            }
            else {
                return WalletVerificationCodes.RC_ADDR_NOT_VERIFIED;
            }
        }
        catch (err) {
            return WalletVerificationCodes.RC_GENERAL_ERROR;
        }
        return (signerAddr === JSON.parse(record.data).ethAddr)
            ? WalletVerificationCodes.RC_OK
            : WalletVerificationCodes.RC_ADDR_WRONG_SIGNATURE;
    };
    WalletUtils.validateWallets = function (key, val, baseID) {
        var result = new WalletVerificationStatus();
        if (key !== WalletManagerImpl_1.WalletManagerImpl.DATA_KEY_ETH_WALLETS) {
            result.err = 'The \<key\> is expected to be "' + WalletManagerImpl_1.WalletManagerImpl.DATA_KEY_ETH_WALLETS + '"';
            result.rc = WalletVerificationCodes.RC_GENERAL_ERROR;
            return result;
        }
        return this.verifyWalletsRecord(baseID, val);
    };
    WalletUtils.verifyWalletsRecord = function (baseID, msg) {
        var e_1, _a;
        var resultCode;
        var status = new WalletVerificationStatus();
        status.rc = WalletVerificationCodes.RC_OK;
        if (!this.baseSchema.validateWallets(msg)) {
            status.rc = WalletVerificationCodes.RC_ADDR_SCHEMA_MISSMATCH;
            return status;
        }
        try {
            // verify all baseID keys are the same in ETH records
            for (var _b = __values(msg.data), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                var pubKey = JSON.parse(item.data).baseID;
                if (pubKey !== baseID) {
                    status.details.push(WalletVerificationCodes.RC_BASEID_MISSMATCH);
                }
                else if ((resultCode = this.verifyAddressRecord(item)) !== WalletVerificationCodes.RC_OK) {
                    status.details.push(resultCode);
                }
                else {
                    status.details.push(WalletVerificationCodes.RC_OK);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // verify signature matches the baseID
        var baseAddr = bitcore.PublicKey.fromString(baseID).toAddress().toString(16);
        var sigCheck = false;
        try {
            if (msg.sig.length > 0) {
                sigCheck = Message(JSON.stringify(msg.data)).verify(baseAddr, msg.sig);
                if (!sigCheck) {
                    status.rc = WalletVerificationCodes.RC_ADDR_WRONG_SIGNATURE;
                }
            }
            else {
                status.rc = WalletVerificationCodes.RC_ADDR_NOT_VERIFIED;
            }
        }
        catch (err) {
            status.rc = WalletVerificationCodes.RC_GENERAL_ERROR;
        }
        return status;
    };
    WalletUtils.createEthereumAddersRecord = function (baseID, ethAddr, ethPrvKey) {
        var record = new BaseTypes_1.AddrRecord(JSON.stringify(new BaseTypes_1.BaseAddrPair(baseID, ethAddr)), '');
        record.sig = EthereumUtils_1.EthereumUtils.createSig(ethPrvKey, record);
        return record;
    };
    WalletUtils.baseSchema = new BaseSchema_1.BaseSchema();
    return WalletUtils;
}());
exports.WalletUtils = WalletUtils;
//# sourceMappingURL=WalletUtils.js.map