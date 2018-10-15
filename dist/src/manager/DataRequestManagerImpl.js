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
var JsonUtils_1 = require("../utils/JsonUtils");
var Permissions_1 = require("../utils/keypair/Permissions");
var DataRequestManagerImpl = /** @class */ (function () {
    function DataRequestManagerImpl(dataRequestRepository, authAccountBehavior, encrypt, decrypt) {
        this.dataRequestRepository = dataRequestRepository;
        this.encrypt = encrypt;
        this.decrypt = decrypt;
        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));
    }
    /**
     * Creates data access request to a specific user for a specific personal data.
     * @param {string} recipientPk Public Key of the user that the personal data is requested from.
     * @param {Array<string>} fields Array of name identifiers for the requested data fields
     * (e.g. this is keys in {Map<string, string>}).
     *
     * @returns {Promise<number>} Returns requestID upon successful request record creation.
     */
    DataRequestManagerImpl.prototype.requestPermissions = function (recipientPk, fields) {
        var _this = this;
        return this.encrypt
            .encryptMessage(recipientPk, JSON.stringify(fields).toLowerCase())
            .then(function (encrypted) { return _this.dataRequestRepository.requestPermissions(recipientPk, encrypted); });
    };
    /**
     * Returns a list of outstanding data access requests, where data access requests meet the provided search criteria.
     * @param {string} fromPk (Optional if toPk exist.) public key of the user that issued data access request.
     * @param {string} toPk (Optional if fromPk exist.) public key of the user that is expected to.
     *
     * @returns {Promise<Array<DataRequest>>}  List of {@link DataRequest}, or empty list
     */
    DataRequestManagerImpl.prototype.getRequests = function (fromPk, toPk) {
        if (fromPk === void 0) { fromPk = ''; }
        if (toPk === void 0) { toPk = ''; }
        return this.dataRequestRepository.getRequests(fromPk, toPk);
    };
    /**
     * Grants access to specific fields of my data to a client.
     * @param {string} clientPk id (baseID) of the client that is authorized for data access.
     * @param {Map<string, AccessRight>} acceptedFields. Array of field names that are authorized for access
     * (e.g. these are keys in {Map<string, string>} - personal data).
     *
     * @returns {Promise<number>}
     */
    DataRequestManagerImpl.prototype.grantAccessForClient = function (clientPk, acceptedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.encrypt.encryptPermissionsFields(clientPk, acceptedFields)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, this.dataRequestRepository.grantAccessForClient(clientPk, this.account.publicKey, response)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Returns list of fields requested for access by <me> from the client
     * @param {string} requestedFromPk id (baseID) of the client whose permissions were requested
     * @returns {Promise<Array<string>>} Array of field names that were requested for access
     */
    DataRequestManagerImpl.prototype.getRequestedPermissions = function (requestedFromPk) {
        return __awaiter(this, void 0, void 0, function () {
            var requests;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRequests(this.account.publicKey, requestedFromPk)];
                    case 1:
                        requests = _a.sent();
                        return [4 /*yield*/, this.decodeRequestedPermissions(requests, requestedFromPk)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Returns list of fields requested for access by the client from <me>
     * @param {string} whoRequestedPk id (baseID) of the client that asked for permission from <me>
     * @returns {Promise<Array<string>>} Array of field names that were requested for access
     */
    DataRequestManagerImpl.prototype.getRequestedPermissionsToMe = function (whoRequestedPk) {
        return __awaiter(this, void 0, void 0, function () {
            var requests;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRequests(whoRequestedPk, this.account.publicKey)];
                    case 1:
                        requests = _a.sent();
                        return [4 /*yield*/, this.decodeRequestedPermissions(requests, whoRequestedPk)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Returns list of fields that <client> authorized <me> to access
     * @param {string} clientPk id (baseID) of the client that granted me permission.
     * @returns {Promise<Array<string>>} Array of field names that were authorized for access
     */
    DataRequestManagerImpl.prototype.getGrantedPermissions = function (clientPk) {
        return __awaiter(this, void 0, void 0, function () {
            var requests;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRequests(this.account.publicKey, clientPk)];
                    case 1:
                        requests = _a.sent();
                        return [4 /*yield*/, this.getDecodeGrantPermissions(requests, clientPk)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Returns list of fields that <me> authorized <client> to access
     * @param {string} clientPk id (baseID) of the client that received access permission from <me>
     * @returns {Promise<Array<string>>} Array of field names that were authorized for access
     */
    DataRequestManagerImpl.prototype.getGrantedPermissionsToMe = function (clientPk) {
        return __awaiter(this, void 0, void 0, function () {
            var requests;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRequests(clientPk, this.account.publicKey)];
                    case 1:
                        requests = _a.sent();
                        return [4 /*yield*/, this.getDecodeGrantPermissions(requests, clientPk)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Grant access for offer.
     * @param {number} offerSearchId id of item search result {@link OfferSearch} and {@link OfferSearchResultItem}.
     * @param {string} offerOwner Public key of offer owner.
     * @param {Map<string, AccessRight>} acceptedFields. Map with names of fields for accept access and access rights.
     * (e.g. this is keys in {Map<string, string>} - personal data).
     *
     * @returns {Promise<void>}
     */
    DataRequestManagerImpl.prototype.grantAccessForOffer = function (offerSearchId, offerOwner, acceptedFields, priceId) {
        var _this = this;
        // automatically grant access to eth_wallets
        acceptedFields.set('eth_wallets', Permissions_1.AccessRight.R);
        return this.encrypt
            .encryptPermissionsFields(offerOwner, acceptedFields)
            .then(function (encrypted) { return _this.dataRequestRepository.grantAccessForOffer(offerSearchId, _this.account.publicKey, encrypted, priceId); });
    };
    /**
     * Decodes a message that was encrypted by the owner of the private key that matches the provided public key.
     * @param {string} senderPk public key of the user that issued data access request.
     * @param {string} encrypted encrypted data from {@link DataRequest#requestData} (ECIES).
     *
     * @returns {object | null} object with data or null if was error.
     */
    DataRequestManagerImpl.prototype.decryptMessage = function (senderPk, encrypted) {
        return this.decrypt.decryptMessage(senderPk, encrypted)
            .then(function (decrypted) {
            try {
                return JSON.parse(decrypted);
            }
            catch (e) {
                return decrypted;
            }
        }).catch(function (reason) { return encrypted; });
    };
    DataRequestManagerImpl.prototype.decodeRequestedPermissions = function (requests, clientPk) {
        return __awaiter(this, void 0, void 0, function () {
            var strDecrypt, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(requests.length > 0 && requests[0].requestData.trim().length > 0)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.decrypt.decryptMessage(clientPk, requests[0].requestData)];
                    case 2:
                        strDecrypt = _a.sent();
                        return [2 /*return*/, JSON.parse(strDecrypt)];
                    case 3:
                        e_1 = _a.sent();
                        return [2 /*return*/, []];
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DataRequestManagerImpl.prototype.getDecodeGrantPermissions = function (requests, clientPk) {
        return __awaiter(this, void 0, void 0, function () {
            var strDecrypt, jsonDecrypt, mapResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(requests.length > 0 && requests[0].responseData.trim().length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.decrypt.decryptMessage(clientPk, requests[0].responseData)];
                    case 1:
                        strDecrypt = _a.sent();
                        jsonDecrypt = JSON.parse(strDecrypt);
                        mapResponse = JsonUtils_1.JsonUtils.jsonToMap(jsonDecrypt);
                        return [2 /*return*/, Array.from(mapResponse.keys())];
                    case 2: return [2 /*return*/, []];
                }
            });
        });
    };
    DataRequestManagerImpl.prototype.onChangeAccount = function (account) {
        this.account = account;
    };
    return DataRequestManagerImpl;
}());
exports.DataRequestManagerImpl = DataRequestManagerImpl;
//# sourceMappingURL=DataRequestManagerImpl.js.map