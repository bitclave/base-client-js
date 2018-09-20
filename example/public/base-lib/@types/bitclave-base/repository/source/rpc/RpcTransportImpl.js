"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpMethod_1 = require("../http/HttpMethod");
var RpcTransportImpl = /** @class */ (function () {
    function RpcTransportImpl(httpTransport) {
        this.id = 0;
        this.transport = httpTransport;
    }
    RpcTransportImpl.prototype.request = function (method, arg) {
        this.id++;
        var data = {
            'jsonrpc': '2.0',
            method: method,
            params: [arg],
            id: this.id
        };
        return this.transport.sendRequest('/', HttpMethod_1.HttpMethod.Post, data)
            .then(function (response) { return response.json['result']; });
    };
    RpcTransportImpl.prototype.disconnect = function () {
    };
    return RpcTransportImpl;
}());
exports.RpcTransportImpl = RpcTransportImpl;
//# sourceMappingURL=RpcTransportImpl.js.map