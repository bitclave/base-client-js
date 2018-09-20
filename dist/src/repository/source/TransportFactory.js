"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpTransportImpl_1 = require("./http/HttpTransportImpl");
var RpcTransportImpl_1 = require("./rpc/RpcTransportImpl");
var HttpTransportSyncedImpl_1 = require("./http/HttpTransportSyncedImpl");
var TransportFactory = /** @class */ (function () {
    function TransportFactory() {
    }
    TransportFactory.createHttpTransport = function (host) {
        return new HttpTransportSyncedImpl_1.HttpTransportSyncedImpl(host);
    };
    TransportFactory.createJsonRpcHttpTransport = function (host) {
        return new RpcTransportImpl_1.RpcTransportImpl(new HttpTransportImpl_1.HttpTransportImpl(host));
    };
    return TransportFactory;
}());
exports.TransportFactory = TransportFactory;
//# sourceMappingURL=TransportFactory.js.map