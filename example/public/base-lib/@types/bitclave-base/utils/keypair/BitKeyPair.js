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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var CryptoUtils_1 = require("../CryptoUtils");
var KeyPair_1 = require("./KeyPair");
var Permissions_1 = require("./Permissions");
var JsonUtils_1 = require("../JsonUtils");
var AcceptedField_1 = require("./AcceptedField");
var bitcore = require('bitcore-lib');
var Message = require('bitcore-message');
var ECIES = require('bitcore-ecies');
var Mnemonic = require('bitcore-mnemonic');
var BitKeyPair = /** @class */ (function () {
    function BitKeyPair(permissionsSource, siteDataSource, origin) {
        this.isConfidential = false;
        this.permissions = new Permissions_1.Permissions();
        this.permissionsSource = permissionsSource;
        this.siteDataSource = siteDataSource;
        this.origin = origin;
    }
    BitKeyPair.prototype.createKeyPair = function (passPhrase) {
        var _this = this;
        return new Promise(function (resolve) {
            var pbkdf2 = CryptoUtils_1.CryptoUtils.PBKDF2(passPhrase, 256);
            var hash = bitcore.crypto.Hash.sha256(new bitcore.deps.Buffer(pbkdf2));
            var bn = bitcore.crypto.BN.fromBuffer(hash);
            _this.privateKey = new bitcore.PrivateKey(bn);
            _this.publicKey = _this.privateKey.toPublicKey();
            _this.addr = _this.privateKey.toAddress();
            var privateKeyHex = _this.privateKey.toString(16);
            var publicKeyHex = _this.publicKey.toString(16);
            resolve(new KeyPair_1.KeyPair(privateKeyHex, publicKeyHex));
        });
    };
    BitKeyPair.prototype.generateMnemonicPhrase = function () {
        return new Promise(function (resolve) {
            var mnemonic = new Mnemonic(Mnemonic.Words.ENGLISH).toString();
            resolve(mnemonic);
        });
    };
    BitKeyPair.prototype.signMessage = function (data) {
        var _this = this;
        return new Promise(function (resolve) {
            var message = new Message(data);
            resolve(message.sign(_this.privateKey));
        });
    };
    BitKeyPair.prototype.checkSig = function (data, sig) {
        var _this = this;
        return new Promise(function (resolve) {
            var result;
            try {
                result = Message(data).verify(_this.privateKey.toAddress(), sig);
            }
            catch (e) {
                result = false;
            }
            resolve(result);
        });
    };
    BitKeyPair.prototype.getPublicKey = function () {
        return this.publicKey.toString(16);
    };
    BitKeyPair.prototype.getAddr = function () {
        return this.addr.toString(16);
    };
    BitKeyPair.prototype.encryptMessage = function (recipientPk, message) {
        var _this = this;
        return new Promise(function (resolve) {
            var ecies = new ECIES({ noKey: true })
                .privateKey(_this.privateKey)
                .publicKey(bitcore.PublicKey.fromString(recipientPk));
            resolve(ecies.encrypt(message)
                .toString('base64'));
        });
    };
    BitKeyPair.prototype.encryptFields = function (fields) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prepareData(fields, true)];
            });
        });
    };
    BitKeyPair.prototype.encryptPermissionsFields = function (recipient, data) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, _a, resultMap, pass, _b, _c, _d, key, value, e_1_1, jsonMap;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        resultMap = new Map();
                        if (!(data != null && data.size > 0)) return [3 /*break*/, 9];
                        pass = void 0;
                        return [4 /*yield*/, this.syncPermissions()];
                    case 1:
                        _e.sent();
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 7, 8, 9]);
                        _b = __values(data.entries()), _c = _b.next();
                        _e.label = 3;
                    case 3:
                        if (!!_c.done) return [3 /*break*/, 6];
                        _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                        if (!this.hasPermissions(key, false)) {
                            return [3 /*break*/, 5];
                        }
                        return [4 /*yield*/, this.generatePasswordForField(key.toLowerCase())];
                    case 4:
                        pass = _e.sent();
                        resultMap.set(key, new AcceptedField_1.AcceptedField(pass, value));
                        _e.label = 5;
                    case 5:
                        _c = _b.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 9:
                        jsonMap = JsonUtils_1.JsonUtils.mapToJson(resultMap);
                        return [4 /*yield*/, this.encryptMessage(recipient, JSON.stringify(jsonMap))];
                    case 10: return [2 /*return*/, _e.sent()];
                }
            });
        });
    };
    BitKeyPair.prototype.decryptMessage = function (senderPk, encrypted) {
        return __awaiter(this, void 0, void 0, function () {
            var ecies, result;
            return __generator(this, function (_a) {
                ecies = new ECIES({ noKey: true })
                    .privateKey(this.privateKey)
                    .publicKey(bitcore.PublicKey.fromString(senderPk));
                result = ecies
                    .decrypt(new Buffer(encrypted, 'base64'))
                    .toString();
                return [2 /*return*/, result];
            });
        });
    };
    BitKeyPair.prototype.decryptFields = function (fields) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prepareData(fields, false)];
            });
        });
    };
    BitKeyPair.prototype.prepareData = function (data, encrypt) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2, _a, result, pass, changedValue, _b, _c, _d, key, value, e_2_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        result = new Map();
                        return [4 /*yield*/, this.syncPermissions()];
                    case 1:
                        _e.sent();
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 7, 8, 9]);
                        _b = __values(data.entries()), _c = _b.next();
                        _e.label = 3;
                    case 3:
                        if (!!_c.done) return [3 /*break*/, 6];
                        _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                        if (!this.hasPermissions(key, !encrypt)) {
                            return [3 /*break*/, 5];
                        }
                        return [4 /*yield*/, this.generatePasswordForField(key)];
                    case 4:
                        pass = _e.sent();
                        if (pass != null && pass !== undefined && pass.length > 0) {
                            changedValue = encrypt
                                ? CryptoUtils_1.CryptoUtils.encryptAes256(value, pass)
                                : CryptoUtils_1.CryptoUtils.decryptAes256(value, pass);
                            result.set(key.toLowerCase(), changedValue);
                        }
                        _e.label = 5;
                    case 5:
                        _c = _b.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_2_1 = _e.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/, result];
                }
            });
        });
    };
    BitKeyPair.prototype.hasPermissions = function (field, read) {
        if (this.isConfidential) {
            return true;
        }
        var keyPermission = this.permissions.fields.get(field);
        return read
            ? keyPermission === Permissions_1.AccessRight.R || keyPermission === Permissions_1.AccessRight.RW
            : keyPermission === Permissions_1.AccessRight.RW;
    };
    BitKeyPair.prototype.syncPermissions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_3, _a, site, requests, _loop_1, this_1, requests_1, requests_1_1, request, e_3_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(!this.isConfidential && this.permissions.fields.size === 0)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.siteDataSource.getSiteData(this.origin)];
                    case 1:
                        site = _b.sent();
                        this.isConfidential = site.confidential;
                        if (!!site.confidential) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.permissionsSource.getGrandAccessRecords(site.publicKey, this.getPublicKey())];
                    case 2:
                        requests = _b.sent();
                        _loop_1 = function (request) {
                            var strDecrypt, jsonDecrypt, resultMap, self_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this_1.decryptMessage(site.publicKey, request.responseData)];
                                    case 1:
                                        strDecrypt = _a.sent();
                                        jsonDecrypt = JSON.parse(strDecrypt);
                                        resultMap = JsonUtils_1.JsonUtils.jsonToMap(jsonDecrypt);
                                        this_1.permissions.fields.clear();
                                        self_1 = this_1;
                                        resultMap.forEach(function (value, key) {
                                            self_1.permissions.fields.set(key, value.access);
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 8, 9, 10]);
                        requests_1 = __values(requests), requests_1_1 = requests_1.next();
                        _b.label = 4;
                    case 4:
                        if (!!requests_1_1.done) return [3 /*break*/, 7];
                        request = requests_1_1.value;
                        return [5 /*yield**/, _loop_1(request)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        requests_1_1 = requests_1.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_3_1 = _b.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (requests_1_1 && !requests_1_1.done && (_a = requests_1.return)) _a.call(requests_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    BitKeyPair.prototype.generatePasswordForField = function (fieldName) {
        var _this = this;
        return new Promise(function (resolve) {
            var result = CryptoUtils_1.CryptoUtils.PBKDF2(CryptoUtils_1.CryptoUtils.keccak256(_this.privateKey.toString(16)) + fieldName.toLowerCase(), 384);
            resolve(result);
        });
    };
    return BitKeyPair;
}());
exports.BitKeyPair = BitKeyPair;
//# sourceMappingURL=BitKeyPair.js.map