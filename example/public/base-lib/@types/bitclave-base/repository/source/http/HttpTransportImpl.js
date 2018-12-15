"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Response_1 = require("./Response");
var InterceptorCortege_1 = require("./InterceptorCortege");
var XMLHttpRequest;
if ((typeof window !== 'undefined' && window.XMLHttpRequest)) {
    XMLHttpRequest = window.XMLHttpRequest;
}
else {
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
}
var HttpTransportImpl = /** @class */ (function () {
    function HttpTransportImpl(host) {
        this.interceptors = [];
        this.headers = new Map([
            ['Accept', 'application/json'], ['Content-Type', 'application/json']
        ]);
        this.host = host;
    }
    HttpTransportImpl.prototype.addInterceptor = function (interceptor) {
        if (this.interceptors.indexOf(interceptor) === -1) {
            this.interceptors.push(interceptor);
        }
        return this;
    };
    // sendRequest(method: HttpMethod, data?: any): Promise<Response>
    HttpTransportImpl.prototype.sendRequest = function (path, method, data) {
        var _this = this;
        return this.acceptInterceptor(new InterceptorCortege_1.InterceptorCortege(path, method, this.headers, data))
            .then(function (cortege) { return new Promise(function (resolve, reject) {
            try {
                var url = cortege.path ? _this.getHost() + cortege.path : _this.getHost();
                var request_1 = new XMLHttpRequest();
                request_1.open(method, url);
                cortege.headers.forEach(function (value, key) {
                    request_1.setRequestHeader(key, value);
                });
                request_1.onload = function () {
                    var result = new Response_1.Response(request_1.responseText, request_1.status);
                    if (request_1.status >= 200 && request_1.status < 300) {
                        resolve(result);
                    }
                    else {
                        reject(result);
                    }
                };
                request_1.onerror = function () {
                    var result = new Response_1.Response(request_1.responseText, request_1.status);
                    reject(result);
                };
                request_1.send(JSON.stringify(cortege.data ? cortege.data : {}));
            }
            catch (e) {
                reject(e);
            }
        }); });
    };
    HttpTransportImpl.prototype.getHost = function () {
        return this.host;
    };
    HttpTransportImpl.prototype.acceptInterceptor = function (interceptorCortege, interceptorIndex) {
        var _this = this;
        if (interceptorIndex === void 0) { interceptorIndex = 0; }
        return (interceptorIndex >= this.interceptors.length)
            ? Promise.resolve(interceptorCortege)
            : this.interceptors[interceptorIndex]
                .onIntercept(interceptorCortege)
                .then(function (interceptorCortegeResult) {
                return _this.acceptInterceptor(interceptorCortegeResult, ++interceptorIndex);
            });
    };
    return HttpTransportImpl;
}());
exports.HttpTransportImpl = HttpTransportImpl;
//# sourceMappingURL=HttpTransportImpl.js.map