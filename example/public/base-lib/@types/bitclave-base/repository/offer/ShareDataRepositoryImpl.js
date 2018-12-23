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
var Permissions_1 = require("../../utils/keypair/Permissions");
var NoncePointer_1 = require("./NoncePointer");
var SubscriptionPointer_1 = require("../service/SubscriptionPointer");
var SharePointer_1 = require("./SharePointer");
var TokenPointer_1 = require("./TokenPointer");
var WalletManagerImpl_1 = require("../../manager/WalletManagerImpl");
var fs = require('fs');
var path = require('path');
// An helper data structure used at the business side to keep track
// of the data field that need to be fetched from service provider
var NoncePointerTuple = /** @class */ (function () {
    function NoncePointerTuple(userEntryKey, sharePointerKey, noncePointer, noncePointerKey) {
        this.userEntryKey = userEntryKey;
        this.sharePointerKey = sharePointerKey;
        this.noncePointer = noncePointer;
        this.noncePointerKey = noncePointerKey;
    }
    return NoncePointerTuple;
}());
var ShareDataRepositoryImpl = /** @class */ (function () {
    function ShareDataRepositoryImpl(dataRequestManager, profileManager, offerShareDataRepository, web3, contractAddress, eth_wallets) {
        this.userShare = 1;
        this.spShare = 1;
        this.dataRequestManager = dataRequestManager;
        this.profileManager = profileManager;
        this.offerShareDataRepository = offerShareDataRepository;
        this.eth_wallets = eth_wallets;
        var parsed = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./Purchase.json")));
        // TODO: set the gasPrice and gas limit here
        this.web3 = web3;
        this.contract = new web3.eth.Contract(parsed.abi, contractAddress, {
            from: contractAddress,
            gasPrice: '0',
            gas: 1000000,
        });
        this.contract.setProvider(web3.currentProvider);
    }
    ShareDataRepositoryImpl.prototype.grantAccessForOffer = function (offerSearchId, offerOwner, acceptedFields, priceId, clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var data, keys;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataRequestManager.grantAccessForOffer(offerSearchId, offerOwner, acceptedFields, priceId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.profileManager.getData()];
                    case 2:
                        data = _a.sent();
                        keys = new Array();
                        acceptedFields.forEach(function (value, key) {
                            var entryData = data.get(key);
                            if (entryData !== undefined && SubscriptionPointer_1.default.conform(entryData)) {
                                // This is a pointer entry, create the key that business will generate
                                var subscriptionPointer = JSON.parse(entryData);
                                keys.push(NoncePointer_1.default.generateKey(clientId, subscriptionPointer.spid));
                            }
                        });
                        // Case: none of the requested data is generated by service provider
                        if (keys.length == 0) {
                            return [2 /*return*/, true];
                        }
                        // Case: some of the requested data is generated by service provider
                        else {
                            // Wait response from business and then notify service provider to
                            // share the data with business
                            return [2 /*return*/, new Promise(function (resolve) {
                                    var timer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                                        var e_1, _a, entries, _b, _c, entry, e_1_1;
                                        return __generator(this, function (_d) {
                                            switch (_d.label) {
                                                case 0: return [4 /*yield*/, this.checkRequestStatus(clientId, offerOwner, keys)];
                                                case 1:
                                                    entries = _d.sent();
                                                    if (!(entries.size == keys.length)) return [3 /*break*/, 10];
                                                    _d.label = 2;
                                                case 2:
                                                    _d.trys.push([2, 7, 8, 9]);
                                                    _b = __values(entries.entries()), _c = _b.next();
                                                    _d.label = 3;
                                                case 3:
                                                    if (!!_c.done) return [3 /*break*/, 6];
                                                    entry = _c.value;
                                                    // Here the key will be a tuple of uid and spid, value will be
                                                    // a business generated nonce, and the transaction key
                                                    return [4 /*yield*/, this.notifyServiceProvider(entry[1], entry[0], offerOwner, this.eth_wallets)];
                                                case 4:
                                                    // Here the key will be a tuple of uid and spid, value will be
                                                    // a business generated nonce, and the transaction key
                                                    _d.sent();
                                                    _d.label = 5;
                                                case 5:
                                                    _c = _b.next();
                                                    return [3 /*break*/, 3];
                                                case 6: return [3 /*break*/, 9];
                                                case 7:
                                                    e_1_1 = _d.sent();
                                                    e_1 = { error: e_1_1 };
                                                    return [3 /*break*/, 9];
                                                case 8:
                                                    try {
                                                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                                                    }
                                                    finally { if (e_1) throw e_1.error; }
                                                    return [7 /*endfinally*/];
                                                case 9:
                                                    resolve(true);
                                                    clearTimeout(timer);
                                                    _d.label = 10;
                                                case 10: return [2 /*return*/];
                                            }
                                        });
                                    }); }, 10000);
                                })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDataRepositoryImpl.prototype.acceptShareData = function (data, uid, bid, searchId, worth) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2, _a, resMap, totalShare, shareValue, transactionValue, user_eth_wallets, spidEntry, _b, _c, entry, subscriptionPointer, spid, trans, transactionKey, transactionHash, receipt, trans, transactionKey, transactionHash, receipt, e_2_1, updates_1, grantedFields, grantFields_1;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        resMap = new Map();
                        totalShare = (data.size - 1) * (this.userShare + this.spShare);
                        shareValue = Math.floor(+worth * ShareDataRepositoryImpl.gwei / totalShare);
                        transactionValue = shareValue * (this.userShare + this.spShare);
                        user_eth_wallets = data.get(WalletManagerImpl_1.WalletManagerImpl.DATA_KEY_ETH_WALLETS);
                        return [4 /*yield*/, this.offerShareDataRepository.acceptShareData(searchId, worth)];
                    case 1:
                        _d.sent();
                        spidEntry = new Map();
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 15, 16, 17]);
                        _b = __values(data.entries()), _c = _b.next();
                        _d.label = 3;
                    case 3:
                        if (!!_c.done) return [3 /*break*/, 14];
                        entry = _c.value;
                        if (entry[0] === WalletManagerImpl_1.WalletManagerImpl.DATA_KEY_ETH_WALLETS) {
                            return [3 /*break*/, 13];
                        }
                        if (!SubscriptionPointer_1.default.conform(entry[1])) return [3 /*break*/, 7];
                        subscriptionPointer = JSON.parse(entry[1]);
                        spid = subscriptionPointer.spid;
                        return [4 /*yield*/, this.contract.methods.InitTransaction(this.userShare * shareValue, this.spShare * shareValue).send({ from: this.eth_wallets, value: transactionValue })];
                    case 4:
                        trans = _d.sent();
                        transactionKey = trans['events']['TransactionInited']['returnValues']['transKey'];
                        transactionHash = trans['transactionHash'];
                        return [4 /*yield*/, this.contract.methods.AssignUser(transactionKey, user_eth_wallets).send({ from: this.eth_wallets })];
                    case 5:
                        _d.sent();
                        // TODO: the schema is not used here
                        spidEntry.set(spid, new NoncePointerTuple(entry[0], SharePointer_1.default.generateKey(uid, bid), new NoncePointer_1.default(this.getRandomInt(), transactionKey), NoncePointer_1.default.generateKey(uid, spid)));
                        return [4 /*yield*/, this.web3.eth.getTransactionReceipt(transactionHash)];
                    case 6:
                        receipt = _d.sent();
                        console.log("transaction details for key: " + entry[0]);
                        console.log(receipt);
                        return [3 /*break*/, 13];
                    case 7:
                        // If the data shared is not generated by service provider (only between user and business), 
                        // this single transaction is finished
                        resMap.set(entry[0], entry[1]);
                        return [4 /*yield*/, this.contract.methods.InitTransaction(transactionValue, 0).send({ from: this.eth_wallets, value: transactionValue })];
                    case 8:
                        trans = _d.sent();
                        transactionKey = trans['events']['TransactionInited']['returnValues']['transKey'];
                        transactionHash = trans['transactionHash'];
                        return [4 /*yield*/, this.contract.methods.AssignUser(transactionKey, user_eth_wallets).send({ from: this.eth_wallets })];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, this.contract.methods.UserConfirm(transactionKey).send({ from: user_eth_wallets })];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, this.contract.methods.BusinessConfirm(transactionKey).send({ from: this.eth_wallets })];
                    case 11:
                        _d.sent();
                        return [4 /*yield*/, this.web3.eth.getTransactionReceipt(transactionHash)];
                    case 12:
                        receipt = _d.sent();
                        console.log("transaction details for key: " + entry[0]);
                        console.log(receipt);
                        _d.label = 13;
                    case 13:
                        _c = _b.next();
                        return [3 /*break*/, 3];
                    case 14: return [3 /*break*/, 17];
                    case 15:
                        e_2_1 = _d.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 17];
                    case 16:
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 17:
                        if (!(spidEntry.size > 0)) return [3 /*break*/, 21];
                        updates_1 = new Map();
                        spidEntry.forEach(function (value) {
                            updates_1.set(value.noncePointerKey, JSON.stringify(value.noncePointer));
                        });
                        return [4 /*yield*/, this.profileManager.updateData(updates_1)];
                    case 18:
                        _d.sent();
                        return [4 /*yield*/, this.dataRequestManager.getGrantedPermissionsToMe(uid)];
                    case 19:
                        grantedFields = _d.sent();
                        grantFields_1 = new Map();
                        grantedFields.forEach(function (field) { return grantFields_1.set(field, Permissions_1.AccessRight.R); });
                        updates_1.forEach(function (value, field) { return grantFields_1.set(field, Permissions_1.AccessRight.R); });
                        return [4 /*yield*/, this.dataRequestManager.grantAccessForClient(uid, grantFields_1)];
                    case 20:
                        _d.sent();
                        return [2 /*return*/, new Promise(function (resolve) {
                                var timer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                                    var spids, i, noncePointerTuple, keyArray, response, dataString, sharePointer;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                spids = Array.from(spidEntry.keys());
                                                i = 0;
                                                _a.label = 1;
                                            case 1:
                                                if (!(i < spids.length)) return [3 /*break*/, 5];
                                                noncePointerTuple = spidEntry.get(spids[i]);
                                                if (noncePointerTuple === undefined) {
                                                    return [3 /*break*/, 4];
                                                }
                                                keyArray = new Array();
                                                keyArray.push(noncePointerTuple.sharePointerKey);
                                                return [4 /*yield*/, this.checkRequestStatus(bid, spids[i], Array.from(keyArray))];
                                            case 2:
                                                response = _a.sent();
                                                dataString = response.get(noncePointerTuple.sharePointerKey);
                                                if (!(dataString !== undefined)) return [3 /*break*/, 4];
                                                sharePointer = JSON.parse(dataString);
                                                if (!this.businessVerifyMessage(sharePointer, uid, bid, noncePointerTuple.noncePointer.nonce)) return [3 /*break*/, 4];
                                                // Confirm data from this service provider is received and is verified, remove the key
                                                // from spidKey
                                                return [4 /*yield*/, this.contract.methods.BusinessConfirm(noncePointerTuple.noncePointer.transactionKey).send({ from: this.eth_wallets })];
                                            case 3:
                                                // Confirm data from this service provider is received and is verified, remove the key
                                                // from spidKey
                                                _a.sent();
                                                resMap.set(noncePointerTuple.userEntryKey, sharePointer.data);
                                                spidEntry.delete(spids[i]);
                                                _a.label = 4;
                                            case 4:
                                                ++i;
                                                return [3 /*break*/, 1];
                                            case 5:
                                                // Check if responses from all service provider has received
                                                if (spidEntry.size == 0) {
                                                    resolve(resMap);
                                                    clearTimeout(timer);
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }, 10000);
                            })];
                    case 21: return [2 /*return*/, resMap];
                }
            });
        });
    };
    ShareDataRepositoryImpl.prototype.shareWithBusiness = function (key, value, uid) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenPointer, bid, transactionKey, entries, data, sharePointer, key_1, updates, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenPointer = JSON.parse(value);
                        bid = TokenPointer_1.TokenPointer.getBID(key);
                        transactionKey = tokenPointer.token.transactionKey;
                        return [4 /*yield*/, this.profileManager.getData()];
                    case 1:
                        entries = _a.sent();
                        data = entries.get(uid);
                        if (!(data === undefined)) return [3 /*break*/, 2];
                        return [2 /*return*/, false];
                    case 2: return [4 /*yield*/, this.contract.methods.AssignSP(transactionKey, this.eth_wallets).send({ from: this.eth_wallets })];
                    case 3:
                        _a.sent();
                        sharePointer = new SharePointer_1.default(tokenPointer, data);
                        key_1 = SharePointer_1.default.generateKey(uid, bid);
                        updates = new Map();
                        updates.set(key_1, JSON.stringify(sharePointer));
                        return [4 /*yield*/, this.profileManager.updateData(updates)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.grantAccessForClientHelper(uid, key_1, Permissions_1.AccessRight.R)];
                    case 5:
                        res = _a.sent();
                        if (!!res) return [3 /*break*/, 6];
                        return [2 /*return*/, false];
                    case 6: return [4 /*yield*/, this.grantAccessForClientHelper(bid, key_1, Permissions_1.AccessRight.R)];
                    case 7:
                        // Grant this entry to business
                        res = _a.sent();
                        if (!!res) return [3 /*break*/, 8];
                        return [2 /*return*/, false];
                    case 8: return [4 /*yield*/, this.contract.methods.SPConfirm(transactionKey).send({ from: this.eth_wallets })];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    ShareDataRepositoryImpl.prototype.isSharePointerExist = function (uid, bid) {
        var _this = this;
        var sharePointerKey = SharePointer_1.default.generateKey(uid, bid);
        return new Promise(function (resolve) {
            _this.profileManager.getData()
                .then(function (data) {
                resolve(data.get(sharePointerKey) ? true : false);
            });
        });
    };
    /**
     * Check whether all the keys are granted.
     * @param from
     * @param to
     * @param keys
     */
    ShareDataRepositoryImpl.prototype.checkRequestStatus = function (from, to, keys) {
        return __awaiter(this, void 0, void 0, function () {
            var res, dataRequests, i, request, data, j, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res = new Map();
                        return [4 /*yield*/, this.dataRequestManager.getRequests(from, to)];
                    case 1:
                        dataRequests = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < dataRequests.length)) return [3 /*break*/, 5];
                        request = dataRequests[i];
                        if (request.responseData.length == 0) {
                            return [3 /*break*/, 4];
                        }
                        return [4 /*yield*/, this.profileManager.getAuthorizedData(request.toPk, request.responseData)];
                    case 3:
                        data = _a.sent();
                        for (j = 0; j < keys.length; ++j) {
                            value = data.get(keys[j]);
                            if (value !== undefined) {
                                res.set(keys[j], value);
                            }
                        }
                        _a.label = 4;
                    case 4:
                        ++i;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, res];
                }
            });
        });
    };
    /**
     * Notify service provider to share data with business by writing TokenPointer in storage
     * and share it with service provider.
     * @param value Business generated nonce
     * @param key A tuple of the uid and spid
     * @param bid Id of the business to share the data
     */
    ShareDataRepositoryImpl.prototype.notifyServiceProvider = function (value, key, bid, eth_wallets) {
        return __awaiter(this, void 0, void 0, function () {
            var uid, spid, noncePointer, dataRequests, dataHash, i, request, entries, data, token, tokenPointer, _a, _b, dataEntryKey, updates, grantedFields, grantFields, i;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        uid = NoncePointer_1.default.getUID(key);
                        spid = NoncePointer_1.default.getSPID(key);
                        noncePointer = JSON.parse(value);
                        return [4 /*yield*/, this.dataRequestManager.getRequests(uid, spid)];
                    case 1:
                        dataRequests = _c.sent();
                        dataHash = '';
                        i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(i < dataRequests.length)) return [3 /*break*/, 5];
                        request = dataRequests[i];
                        return [4 /*yield*/, this.profileManager.getAuthorizedData(request.toPk, request.responseData)];
                    case 3:
                        entries = _c.sent();
                        data = entries.get(uid);
                        if (data !== undefined) {
                            dataHash = this.calculateHash(data);
                            return [3 /*break*/, 5];
                        }
                        _c.label = 4;
                    case 4:
                        ++i;
                        return [3 /*break*/, 2];
                    case 5:
                        token = new TokenPointer_1.Token(bid, noncePointer.nonce, dataHash, Date.now().toString(), noncePointer.transactionKey);
                        _a = TokenPointer_1.TokenPointer.bind;
                        _b = [void 0, token];
                        return [4 /*yield*/, this.profileManager.signMessage(JSON.stringify(token))];
                    case 6:
                        tokenPointer = new (_a.apply(TokenPointer_1.TokenPointer, _b.concat([_c.sent()])))();
                        dataEntryKey = TokenPointer_1.TokenPointer.generateKey(bid, spid);
                        updates = new Map();
                        // Write own storage
                        updates.set(dataEntryKey, JSON.stringify(tokenPointer));
                        return [4 /*yield*/, this.profileManager.updateData(updates)];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, this.dataRequestManager.getGrantedPermissionsToMe(spid)];
                    case 8:
                        grantedFields = _c.sent();
                        grantFields = new Map();
                        for (i = 0; i < grantedFields.length; ++i) {
                            grantFields.set(grantedFields[i], Permissions_1.AccessRight.R);
                        }
                        grantFields.set(dataEntryKey, Permissions_1.AccessRight.R);
                        return [4 /*yield*/, this.dataRequestManager.grantAccessForClient(spid, grantFields)];
                    case 9:
                        _c.sent();
                        // Confirm data has been sent
                        return [4 /*yield*/, this.contract.methods.UserConfirm(noncePointer.transactionKey).send({ from: eth_wallets })];
                    case 10:
                        // Confirm data has been sent
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDataRepositoryImpl.prototype.calculateHash = function (message) {
        var crypto = require('crypto');
        return crypto.createHash('sha256').update(message).digest('hex');
    };
    ShareDataRepositoryImpl.prototype.grantAccessForClientHelper = function (clientId, key, permission) {
        var _this = this;
        // Get the current status first
        return new Promise(function (resolve) {
            _this.dataRequestManager.getGrantedPermissionsToMe(clientId)
                .then(function (grantedFields) {
                var grantFields = new Map();
                grantedFields.forEach(function (field) { return grantFields.set(field, Permissions_1.AccessRight.R); });
                grantFields.set(key, permission);
                _this.dataRequestManager.grantAccessForClient(clientId, grantFields)
                    .then(function () { return resolve(true); })
                    .catch(function () { return resolve(false); });
            })
                .catch(function () { return resolve(false); });
        });
    };
    /**
     * Helper function to verify the data received at business side
     * @param sharePointer
     * @param uid
     * @param bid
     * @param nonce
     */
    ShareDataRepositoryImpl.prototype.businessVerifyMessage = function (sharePointer, uid, bid, nonce) {
        var Message = require('bitcore-message');
        var bitcore = require('bitcore-lib');
        var addrUser = bitcore.Address(bitcore.PublicKey(uid));
        // Verify signature
        if (!Message(JSON.stringify(sharePointer.tokenPointer.token)).verify(addrUser, sharePointer.tokenPointer.signature)) {
            return false;
        }
        // Verify bid & nonce & hash of data
        if (sharePointer.tokenPointer.token.bid !== bid
            || sharePointer.tokenPointer.token.nonce !== nonce
            || sharePointer.tokenPointer.token.dataHash !== this.calculateHash(sharePointer.data)) {
            return false;
        }
        return true;
    };
    ShareDataRepositoryImpl.prototype.getRandomInt = function () {
        return Math.floor(Math.random() * (ShareDataRepositoryImpl.max - ShareDataRepositoryImpl.min + 1)) + ShareDataRepositoryImpl.min;
    };
    ShareDataRepositoryImpl.min = 1;
    ShareDataRepositoryImpl.max = 0x7FFFFFFF;
    ShareDataRepositoryImpl.gwei = 1000000000;
    return ShareDataRepositoryImpl;
}());
exports.default = ShareDataRepositoryImpl;
//# sourceMappingURL=ShareDataRepositoryImpl.js.map