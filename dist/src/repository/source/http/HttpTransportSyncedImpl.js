"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Response_1 = require("./Response");
var InterceptorCortege_1 = require("./InterceptorCortege");
var Transaction_1 = require("./Transaction");
var XMLHttpRequest;
if ((typeof window !== 'undefined' && window.XMLHttpRequest)) {
    XMLHttpRequest = window.XMLHttpRequest;
}
else {
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
}
var HttpTransportSyncedImpl = /** @class */ (function () {
    function HttpTransportSyncedImpl(host) {
        this.interceptors = [];
        this.transactions = [];
        this.headers = new Map([
            ['Accept', 'application/json'], ['Content-Type', 'application/json']
        ]);
        this.host = host;
    }
    HttpTransportSyncedImpl.prototype.addInterceptor = function (interceptor) {
        if (this.interceptors.indexOf(interceptor) === -1) {
            this.interceptors.push(interceptor);
        }
        return this;
    };
    HttpTransportSyncedImpl.prototype.sendRequest = function (path, method, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var cortege = new InterceptorCortege_1.InterceptorCortege(path, method, _this.headers, data);
            _this.transactions.push(new Transaction_1.default(resolve, reject, cortege));
            if (_this.transactions.length === 1) {
                _this.runTransaction(_this.transactions[0]);
            }
        });
    };
    HttpTransportSyncedImpl.prototype.getHost = function () {
        return this.host;
    };
    HttpTransportSyncedImpl.prototype.acceptInterceptor = function (interceptorCortege, interceptorIndex) {
        var _this = this;
        if (interceptorIndex === void 0) { interceptorIndex = 0; }
        return (interceptorIndex >= this.interceptors.length)
            ? Promise.resolve(interceptorCortege)
            : this.interceptors[interceptorIndex].onIntercept(interceptorCortege).then(function (interceptorCortegeResult) {
                return _this.acceptInterceptor(interceptorCortegeResult, ++interceptorIndex);
            });
    };
    HttpTransportSyncedImpl.prototype.runTransaction = function (transaction) {
        var _this = this;
        this.acceptInterceptor(transaction.cortege)
            .then(function (someCortege) { return new Promise(function (resolve, reject) {
            try {
                var cortege = transaction.cortege;
                var url = cortege.path ? _this.getHost() + cortege.path : _this.getHost();
                var request_1 = new XMLHttpRequest();
                request_1.open(cortege.method, url);
                cortege.headers.forEach(function (value, key) {
                    request_1.setRequestHeader(key, value);
                });
                request_1.onload = function () {
                    var result = new Response_1.Response(request_1.responseText, request_1.status);
                    if (request_1.status >= 200 && request_1.status < 300) {
                        resolve();
                        transaction.resolve(result);
                        _this.callNextRequest();
                    }
                    else {
                        reject();
                        transaction.reject(result);
                        _this.callNextRequest();
                    }
                };
                request_1.onerror = function () {
                    var result = new Response_1.Response(request_1.responseText, request_1.status);
                    reject();
                    transaction.reject(result);
                    _this.callNextRequest();
                };
                request_1.send(JSON.stringify(cortege.data ? cortege.data : {}));
            }
            catch (e) {
                reject();
                transaction.reject(e);
                _this.callNextRequest();
            }
        }); });
    };
    HttpTransportSyncedImpl.prototype.callNextRequest = function () {
        this.transactions.shift();
        if (this.transactions.length > 0) {
            this.runTransaction(this.transactions[0]);
        }
    };
    return HttpTransportSyncedImpl;
}());
exports.HttpTransportSyncedImpl = HttpTransportSyncedImpl;
//# sourceMappingURL=HttpTransportSyncedImpl.js.map