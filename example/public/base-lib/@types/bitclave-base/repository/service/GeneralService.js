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
var Service_1 = require("./Service");
var Permissions_1 = require("../../utils/keypair/Permissions");
var GeneralService = /** @class */ (function () {
    function GeneralService(serviceInfo, profileManager, dataRequestManager) {
        this.profileManager = profileManager;
        this.dataRequestManager = dataRequestManager;
        this._serviceInfo = serviceInfo;
        this.subscribers = new Set();
    }
    Object.defineProperty(GeneralService.prototype, "serviceInfo", {
        get: function () {
            return this._serviceInfo;
        },
        enumerable: true,
        configurable: true
    });
    GeneralService.prototype.toJsonString = function () {
        return JSON.stringify(this._serviceInfo);
    };
    GeneralService.prototype.addSubscriber = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var updates, grantFields, keys, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.subscribers.has(uid)) return [3 /*break*/, 4];
                        /**
                         * Create an data entry with the following format:
                         * uid: processing / deny
                         * And share back to the client with uid
                         */
                        // TODO: add deny logic
                        this.subscribers.add(uid);
                        updates = new Map();
                        updates.set(uid, Service_1.ServiceInfo.SUBSCRIPTION_PROCESSING);
                        return [4 /*yield*/, this.profileManager.updateData(updates)];
                    case 1:
                        _a.sent();
                        grantFields = new Map();
                        return [4 /*yield*/, this.dataRequestManager.getGrantedPermissionsToMe(uid)];
                    case 2:
                        keys = _a.sent();
                        for (i = 0; i < keys.length; ++i) {
                            grantFields.set(keys[i], Permissions_1.AccessRight.R);
                        }
                        grantFields.set(uid, Permissions_1.AccessRight.R);
                        return [4 /*yield*/, this.dataRequestManager.grantAccessForClient(uid, grantFields)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    GeneralService.prototype.removeSubscriber = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: In the current implementation, remove operation
                // is done by set "deny" into the data entry
                this.updateData(uid, Service_1.ServiceInfo.SUBSCRIPTION_DENY);
                return [2 /*return*/];
            });
        });
    };
    GeneralService.prototype.updateData = function (uid, data) {
        return __awaiter(this, void 0, void 0, function () {
            var updates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.subscribers.has(uid)) return [3 /*break*/, 2];
                        updates = new Map();
                        updates.set(uid, data);
                        return [4 /*yield*/, this.profileManager.updateData(updates)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return GeneralService;
}());
exports.default = GeneralService;
//# sourceMappingURL=GeneralService.js.map