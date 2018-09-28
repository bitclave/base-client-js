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
var OfferShareData_1 = require("./../models/OfferShareData");
var fetch = require('node-fetch');
var OfferShareDataRepositoryImpl = /** @class */ (function () {
    function OfferShareDataRepositoryImpl(host, accountManager, profileManager) {
        this.SHARE_DATA_API = '/v1/data/offer/';
        this.NONCE_DATA_API = '/v1/nonce/';
        this.host = host;
        this.accountManager = accountManager;
        this.profileManager = profileManager;
    }
    OfferShareDataRepositoryImpl.prototype.getShareData = function (owner, accepted) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, _a, url, response, json, result, json_1, json_1_1, item;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = this.host + this.SHARE_DATA_API +
                            ("?owner=" + owner + "&accepted=" + accepted.toString());
                        return [4 /*yield*/, fetch(url, { method: 'GET' })];
                    case 1:
                        response = _b.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = _b.sent();
                        result = [];
                        try {
                            for (json_1 = __values(json), json_1_1 = json_1.next(); !json_1_1.done; json_1_1 = json_1.next()) {
                                item = json_1_1.value;
                                result.push(Object.assign(new OfferShareData_1.default(0, '', 0), item));
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (json_1_1 && !json_1_1.done && (_a = json_1.return)) _a.call(json_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    OfferShareDataRepositoryImpl.prototype.acceptShareData = function (searchId, worth) {
        return __awaiter(this, void 0, void 0, function () {
            var publicKey, nonceUrl, nonceResponse, nonce, _a, acceptUrl, data, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        publicKey = this.accountManager
                            .getAccount()
                            .publicKey;
                        nonceUrl = this.host + this.NONCE_DATA_API + publicKey;
                        return [4 /*yield*/, fetch(nonceUrl, { method: 'GET' })];
                    case 1:
                        nonceResponse = _c.sent();
                        _a = parseInt;
                        return [4 /*yield*/, nonceResponse.json()];
                    case 2:
                        nonce = _a.apply(void 0, [_c.sent(), 10]);
                        acceptUrl = this.host + this.SHARE_DATA_API + ("?offerSearchId=" + searchId);
                        _b = {
                            data: worth,
                            pk: publicKey
                        };
                        return [4 /*yield*/, this.profileManager.signMessage(worth)];
                    case 3:
                        data = (_b.sig = _c.sent(),
                            _b.nonce = ++nonce,
                            _b);
                        return [4 /*yield*/, fetch(acceptUrl, {
                                headers: { 'Content-Type': 'application/json' },
                                method: 'PATCH',
                                body: JSON.stringify(data)
                            })];
                    case 4:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return OfferShareDataRepositoryImpl;
}());
exports.default = OfferShareDataRepositoryImpl;
//# sourceMappingURL=OfferShareDataRepositoryImpl.js.map