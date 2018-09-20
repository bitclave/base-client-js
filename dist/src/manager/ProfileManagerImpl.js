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
Object.defineProperty(exports, "__esModule", { value: true });
var Account_1 = require("../repository/models/Account");
var CryptoUtils_1 = require("../utils/CryptoUtils");
var JsonUtils_1 = require("../utils/JsonUtils");
var ProfileManagerImpl = /** @class */ (function () {
    function ProfileManagerImpl(clientRepository, authAccountBehavior, encrypt, decrypt, signer) {
        this.account = new Account_1.default();
        this.clientDataRepository = clientRepository;
        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));
        this.encrypt = encrypt;
        this.decrypt = decrypt;
        this.signer = signer;
    }
    ProfileManagerImpl.prototype.signMessage = function (data) {
        return this.signer.signMessage(data);
    };
    /**
     * Returns decrypted data of the authorized user.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    ProfileManagerImpl.prototype.getData = function () {
        var _this = this;
        return this.getRawData(this.account.publicKey)
            .then(function (rawData) { return _this.decrypt.decryptFields(rawData); });
    };
    /**
     * Returns raw (encrypted) data of user with provided ID (Public Key).
     * @param {string} anyPublicKey Public key of client.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    ProfileManagerImpl.prototype.getRawData = function (anyPublicKey) {
        return this.clientDataRepository.getData(anyPublicKey);
    };
    /**
     * Decrypts accepted personal data {@link DataRequest#responseData}.
     * @param {string} recipientPk  Public key of the user that shared the data
     * @param {string} encryptedData encrypted data {@link DataRequest#responseData}.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    ProfileManagerImpl.prototype.getAuthorizedData = function (recipientPk, encryptedData) {
        return __awaiter(this, void 0, void 0, function () {
            var strDecrypt, jsonDecrypt, arrayResponse, result, recipientData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.decrypt.decryptMessage(recipientPk, encryptedData)];
                    case 1:
                        strDecrypt = _a.sent();
                        jsonDecrypt = JSON.parse(strDecrypt);
                        arrayResponse = JsonUtils_1.JsonUtils.jsonToMap(jsonDecrypt);
                        result = new Map();
                        return [4 /*yield*/, this.getRawData(recipientPk)];
                    case 2:
                        recipientData = (_a.sent()) || new Map();
                        arrayResponse.forEach(function (value, key) {
                            if (recipientData.has(key)) {
                                try {
                                    var data = recipientData.get(key);
                                    var decryptedValue = CryptoUtils_1.CryptoUtils.decryptAes256(data, value.pass);
                                    result.set(key, decryptedValue);
                                }
                                catch (e) {
                                    console.log('decryption error: ', key, ' => ', recipientData.get(key), e);
                                }
                            }
                        });
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Returns decryption keys for approved personal data {@link DataRequest#responseData}.
     * @param {string} recipientPk  Public key of the user that shared the data
     * @param {string} encryptedData encrypted data {@link DataRequest#responseData}.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    ProfileManagerImpl.prototype.getAuthorizedEncryptionKeys = function (recipientPk, encryptedData) {
        return __awaiter(this, void 0, void 0, function () {
            var strDecrypt, jsonDecrypt, arrayResponse, result, recipientData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.decrypt.decryptMessage(recipientPk, encryptedData)];
                    case 1:
                        strDecrypt = _a.sent();
                        jsonDecrypt = JSON.parse(strDecrypt);
                        arrayResponse = JsonUtils_1.JsonUtils.jsonToMap(jsonDecrypt);
                        result = new Map();
                        return [4 /*yield*/, this.getRawData(recipientPk)];
                    case 2:
                        recipientData = _a.sent();
                        arrayResponse.forEach(function (value, key) {
                            if (recipientData.has(key)) {
                                result.set(key, value.pass);
                            }
                        });
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Encrypts and stores personal data in BASE.
     * @param {Map<string, string>} data not encrypted data e.g. Map {"name": "Adam"} etc.
     *
     * @returns {Promise<Map<string, string>>} Map with encrypted data.
     */
    ProfileManagerImpl.prototype.updateData = function (data) {
        var _this = this;
        return this.encrypt.encryptFields(data)
            .then(function (encrypted) { return _this.clientDataRepository.updateData(_this.account.publicKey, encrypted); });
    };
    ProfileManagerImpl.prototype.onChangeAccount = function (account) {
        this.account = account;
    };
    return ProfileManagerImpl;
}());
exports.ProfileManagerImpl = ProfileManagerImpl;
//# sourceMappingURL=ProfileManagerImpl.js.map