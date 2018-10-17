"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var BaseTypes_1 = require("../utils/types/BaseTypes");
var Account_1 = require("../repository/models/Account");
var WalletUtils_1 = require("../utils/WalletUtils");
var Permissions_1 = require("../utils/keypair/Permissions");
var WalletManagerImpl = /** @class */ (function () {
    function WalletManagerImpl(profileManager, dataRequestManager, baseSchema, messageSigner, authAccountBehavior) {
        this.account = new Account_1.default();
        this.profileManager = profileManager;
        this.dataRequestManager = dataRequestManager;
        this.baseSchema = baseSchema;
        this.messageSigner = messageSigner;
        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));
    }
    WalletManagerImpl.prototype.createWalletsRecords = function (wallets, baseID) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, _a, wallets_1, wallets_1_1, msg, msgWallets, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        try {
                            for (wallets_1 = __values(wallets), wallets_1_1 = wallets_1.next(); !wallets_1_1.done; wallets_1_1 = wallets_1.next()) {
                                msg = wallets_1_1.value;
                                if ((WalletUtils_1.WalletUtils.verifyAddressRecord(msg) !== WalletUtils_1.WalletVerificationCodes.RC_OK) &&
                                    (WalletUtils_1.WalletUtils.verifyAddressRecord(msg) !== WalletUtils_1.WalletVerificationCodes.RC_ADDR_NOT_VERIFIED)) {
                                    throw 'invalid eth record: ' + msg;
                                }
                                if (baseID !== JSON.parse(msg.data).baseID) {
                                    throw 'baseID missmatch';
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (wallets_1_1 && !wallets_1_1.done && (_a = wallets_1.return)) _a.call(wallets_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        msgWallets = new BaseTypes_1.WalletsRecords(wallets, '');
                        if (!this.baseSchema.validateWallets(msgWallets)) {
                            throw 'invalid wallets structure';
                        }
                        // eth style signing
                        // msgWallets.sig = sigUtil.personalSign(Buffer.from(prvKey, 'hex'), msgWallets);
                        // var signerAddr = sigUtil.recoverPersonalSignature(msgWallets)
                        // BASE Style signing
                        _b = msgWallets;
                        return [4 /*yield*/, this.messageSigner.signMessage(JSON.stringify(msgWallets.data))];
                    case 1:
                        // eth style signing
                        // msgWallets.sig = sigUtil.personalSign(Buffer.from(prvKey, 'hex'), msgWallets);
                        // var signerAddr = sigUtil.recoverPersonalSignature(msgWallets)
                        // BASE Style signing
                        _b.sig = _c.sent();
                        return [2 /*return*/, msgWallets];
                }
            });
        });
    };
    WalletManagerImpl.prototype.addWealthValidator = function (validatorPbKey) {
        return __awaiter(this, void 0, void 0, function () {
            var myData, acceptedFields;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.profileManager.getData()];
                    case 1:
                        myData = _a.sent();
                        myData.set(WalletManagerImpl.DATA_KEY_ETH_WEALTH_VALIDATOR, validatorPbKey);
                        return [4 /*yield*/, this.profileManager.updateData(myData)];
                    case 2:
                        _a.sent();
                        acceptedFields = new Map();
                        acceptedFields.set(WalletManagerImpl.DATA_KEY_ETH_WALLETS, Permissions_1.AccessRight.RW);
                        return [4 /*yield*/, this.dataRequestManager.grantAccessForClient(validatorPbKey, acceptedFields)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WalletManagerImpl.prototype.refreshWealthPtr = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, wealthPtr, wealth, validatorPbKey, recordsFromValidator, decryptionKeys, wealthDecKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.profileManager.getData()];
                    case 1:
                        data = _a.sent();
                        if (!data.has(WalletManagerImpl.DATA_KEY_WEALTH)) return [3 /*break*/, 2];
                        wealth = data.get(WalletManagerImpl.DATA_KEY_WEALTH) || '';
                        wealthPtr = Object.assign(new BaseTypes_1.WealthPtr(), JSON.parse(wealth));
                        return [3 /*break*/, 9];
                    case 2:
                        if (!data.has(WalletManagerImpl.DATA_KEY_ETH_WEALTH_VALIDATOR)) return [3 /*break*/, 8];
                        validatorPbKey = data.get(WalletManagerImpl.DATA_KEY_ETH_WEALTH_VALIDATOR) || '';
                        return [4 /*yield*/, this.dataRequestManager.getRequests(this.account.publicKey, validatorPbKey)];
                    case 3:
                        recordsFromValidator = _a.sent();
                        if (!(recordsFromValidator.length > 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.profileManager.getAuthorizedEncryptionKeys(validatorPbKey, recordsFromValidator[0].responseData)];
                    case 4:
                        decryptionKeys = _a.sent();
                        wealthDecKey = decryptionKeys.get(this.account.publicKey) || '';
                        // Alice adds wealth record pointing to Validator's storage
                        wealthPtr = new BaseTypes_1.WealthPtr(validatorPbKey, wealthDecKey);
                        data.set(WalletManagerImpl.DATA_KEY_WEALTH, JSON.stringify(wealthPtr));
                        return [4 /*yield*/, this.profileManager.updateData(data)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6: throw 'validator did not verify anything yet';
                    case 7: return [3 /*break*/, 9];
                    case 8: throw WalletManagerImpl.DATA_KEY_ETH_WEALTH_VALIDATOR + ' data not exist!';
                    case 9: return [2 /*return*/, wealthPtr];
                }
            });
        });
    };
    WalletManagerImpl.prototype.validateWallets = function (walletRecords) {
        return this.baseSchema.validateWallets(walletRecords);
    };
    WalletManagerImpl.prototype.onChangeAccount = function (account) {
        this.account = account;
    };
    WalletManagerImpl.DATA_KEY_ETH_WALLETS = 'eth_wallets';
    WalletManagerImpl.DATA_KEY_ETH_WEALTH_VALIDATOR = 'ethwealthvalidator';
    WalletManagerImpl.DATA_KEY_WEALTH = 'wealth';
    return WalletManagerImpl;
}());
exports.WalletManagerImpl = WalletManagerImpl;
//# sourceMappingURL=WalletManagerImpl.js.map