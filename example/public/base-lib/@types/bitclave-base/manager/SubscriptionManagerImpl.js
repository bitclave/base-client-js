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
var Service_1 = require("../repository/service/Service");
var Permissions_1 = require("../utils/keypair/Permissions");
var SubscriptionPointer_1 = require("../repository/service/SubscriptionPointer");
var SubscriptionManagerImpl = /** @class */ (function () {
    function SubscriptionManagerImpl(profileManager, dataRequestManager, authAccountBehavior) {
        this.account = new Account_1.default();
        this.nameServiceId = '';
        this.profileManager = profileManager;
        this.dataRequestManager = dataRequestManager;
        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));
    }
    /**
     *
     * @param id public id of the service provider that provides the
     * name service.
     */
    // TODO: need a better way to set up name service's id
    SubscriptionManagerImpl.prototype.setNameServiceId = function (id) {
        this.nameServiceId = id;
    };
    /**
     * Query the name service to look up a list of service providers
     * that have the given types.
     * @param serviceType
     */
    SubscriptionManagerImpl.prototype.getServiceProviders = function (serviceType) {
        var _this = this;
        if (this.nameServiceId.length === 0) {
            return new Promise(function (resolve, reject) {
                resolve(new Array());
            });
        }
        // TODO: Since we are using global service type, have a check of the serviceType here.
        return this.dataRequestManager.getRequestedPermissions(this.nameServiceId).then(function (keys) {
            // Get all the previously requested keys
            if (keys.indexOf(serviceType) === -1) {
                keys.push(serviceType);
            }
            return _this.dataRequestManager.requestPermissions(_this.nameServiceId, keys).then(function () {
                return new Promise(function (resolve, reject) {
                    var timer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var res, data, types;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.checkRequestStatus(this.account.publicKey, this.nameServiceId, serviceType)];
                                case 1:
                                    res = _a.sent();
                                    data = res.get(serviceType);
                                    if (data !== undefined) {
                                        types = JSON.parse(data);
                                        resolve(types.spids);
                                        clearTimeout(timer);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 10000);
                });
            });
        });
    };
    /**
     * Retrieve the service info of the given service provider.
     * @param spid
     */
    SubscriptionManagerImpl.prototype.getServiceInfo = function (spid) {
        var _this = this;
        return this.dataRequestManager.getRequestedPermissions(spid).then(function (keys) {
            // Get all the previously requested keys
            if (keys.indexOf(SubscriptionManagerImpl.KEY_SERVICE_INFO) === -1) {
                keys.push(SubscriptionManagerImpl.KEY_SERVICE_INFO);
            }
            return _this.dataRequestManager.requestPermissions(spid, keys).then(function () {
                // Pool the request status
                return new Promise(function (resolve, reject) {
                    var timer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var res, data, serviceInfo;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.checkRequestStatus(this.account.publicKey, spid, SubscriptionManagerImpl.KEY_SERVICE_INFO)];
                                case 1:
                                    res = _a.sent();
                                    data = res.get(SubscriptionManagerImpl.KEY_SERVICE_INFO);
                                    if (data !== undefined) {
                                        serviceInfo = JSON.parse(data);
                                        resolve(serviceInfo);
                                        clearTimeout(timer);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 10000);
                });
            });
        });
    };
    /**
     * Subscribe to the given service provider
     * @param serviceInfo
     */
    SubscriptionManagerImpl.prototype.subscribe = function (serviceInfo) {
        var _this = this;
        // Send subscription request to service provider by grant all
        // the required data entries
        return this.profileManager.getData().then(function (data) {
            return new Promise(function (resolve, reject) {
                var grantFields = new Map();
                for (var i = 0; i < serviceInfo.requiredKeys.length; ++i) {
                    var key = serviceInfo.requiredKeys[i];
                    if (!data.has(key)) {
                        return resolve(false);
                    }
                    grantFields.set(key, Permissions_1.AccessRight.R);
                }
                // Get all previously granted permissions
                _this.dataRequestManager.getGrantedPermissionsToMe(serviceInfo.id).then(function (keys) {
                    for (var i = 0; i < keys.length; ++i) {
                        // TODO: getGrantedPermissionsToMe only returns a list of entries
                        // that have been granted to the client, but we do not know the
                        // corresponding AccessRight
                        grantFields.set(keys[i], Permissions_1.AccessRight.R);
                    }
                    _this.dataRequestManager.grantAccessForClient(serviceInfo.id, grantFields).then(function () {
                        return resolve(true);
                    });
                });
            });
        }).then(function (valid) {
            return new Promise(function (resolve, reject) {
                if (!valid) {
                    return resolve(false);
                }
                else {
                    var timer_1 = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var res, data, updates;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.checkRequestStatus(this.account.publicKey, serviceInfo.id, this.account.publicKey)];
                                case 1:
                                    res = _a.sent();
                                    data = res.get(this.account.publicKey);
                                    if (!(data !== undefined)) return [3 /*break*/, 4];
                                    if (!(data === Service_1.ServiceInfo.SUBSCRIPTION_DENY)) return [3 /*break*/, 2];
                                    resolve(false);
                                    clearTimeout(timer_1);
                                    return [3 /*break*/, 4];
                                case 2:
                                    updates = new Map();
                                    // Add service provider pointer into own storage
                                    updates.set(serviceInfo.type, JSON.stringify(new SubscriptionPointer_1.default(serviceInfo.id, serviceInfo.type)));
                                    return [4 /*yield*/, this.profileManager.updateData(updates)];
                                case 3:
                                    _a.sent();
                                    resolve(true);
                                    clearTimeout(timer_1);
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }, 10000);
                }
            });
        });
    };
    /**
     * Announce the service. If an id of the name service is provided, then
     * the service will be added to that name service.
     * @param service
     */
    SubscriptionManagerImpl.prototype.announceService = function (service) {
        var _this = this;
        // Add a "service" entry into the storage
        var update = new Map();
        update.set(SubscriptionManagerImpl.KEY_SERVICE_INFO, service.toJsonString());
        return this.profileManager.updateData(update).then(function () {
            return new Promise(function (resolve, reject) {
                // Register it with the name service if presents
                if (_this.nameServiceId.length > 0) {
                    _this.getServiceInfo(_this.nameServiceId).then(function (serviceInfo) {
                        _this.subscribe(serviceInfo).then(function (res) {
                            resolve(res);
                        });
                    });
                }
                else {
                    resolve(true);
                }
            });
        });
    };
    /**
     * Get the latest data from the service provider
     * @param spid
     */
    SubscriptionManagerImpl.prototype.getProcessedData = function (spid) {
        var _this = this;
        // Check the data entry pointer shared back by this service provider
        return this.dataRequestManager.getRequests(this.account.publicKey, spid).then(function (dataRequests) {
            return _this.checkRequestStatus(_this.account.publicKey, spid, _this.account.publicKey);
        }).then(function (data) {
            return new Promise(function (resolve, reject) {
                if (data.size > 0) {
                    resolve(data.get(_this.account.publicKey));
                }
                else {
                    resolve('');
                }
            });
        });
    };
    SubscriptionManagerImpl.prototype.getSubscriptions = function () {
        // TODO: The only way to implement this function at the current design
        // seems like to be scan a list of service types of the clients?
        return new Promise(function (resolve, reject) {
            resolve(new Map());
        });
    };
    /**
     * Private helper function to check whether the data request is fulfilled
     * @param from
     * @param to
     * @param key
     */
    SubscriptionManagerImpl.prototype.checkRequestStatus = function (from, to, key) {
        return __awaiter(this, void 0, void 0, function () {
            var result, dataRequests, i, request, data, entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = new Map();
                        return [4 /*yield*/, this.dataRequestManager.getRequests(from, to)];
                    case 1:
                        dataRequests = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < dataRequests.length)) return [3 /*break*/, 5];
                        request = dataRequests[i];
                        // If this request has been granted
                        if (request.responseData.length === 0) {
                            return [3 /*break*/, 4];
                        }
                        return [4 /*yield*/, this.profileManager.getAuthorizedData(request.toPk, request.responseData)];
                    case 3:
                        data = _a.sent();
                        entry = data.get(key);
                        if (entry !== undefined) {
                            result.set(key, entry);
                            return [3 /*break*/, 5];
                        }
                        _a.label = 4;
                    case 4:
                        ++i;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, result];
                }
            });
        });
    };
    SubscriptionManagerImpl.prototype.onChangeAccount = function (account) {
        this.account = account;
    };
    SubscriptionManagerImpl.KEY_SERVICE_INFO = 'service';
    SubscriptionManagerImpl.KEY_SUBSCRIPTION = 'subscription';
    return SubscriptionManagerImpl;
}());
exports.SubscriptionManagerImpl = SubscriptionManagerImpl;
//# sourceMappingURL=SubscriptionManagerImpl.js.map