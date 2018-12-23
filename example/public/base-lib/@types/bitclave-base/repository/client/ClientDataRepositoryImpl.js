"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpMethod_1 = require("../source/http/HttpMethod");
var JsonUtils_1 = require("../../utils/JsonUtils");
var ClientDataRepositoryImpl = /** @class */ (function () {
    function ClientDataRepositoryImpl(transport) {
        this.CLIENT_GET_DATA = '/v1/client/{pk}/';
        this.CLIENT_SET_DATA = '/v1/client/';
        this.transport = transport;
    }
    ClientDataRepositoryImpl.prototype.getData = function (pk) {
        return this.transport
            .sendRequest(this.CLIENT_GET_DATA.replace('{pk}', pk), HttpMethod_1.HttpMethod.Get)
            .then(function (response) { return JsonUtils_1.JsonUtils.jsonToMap(response.json); });
    };
    ClientDataRepositoryImpl.prototype.updateData = function (pk, data) {
        return this.transport
            .sendRequest(this.CLIENT_SET_DATA, HttpMethod_1.HttpMethod.Patch, JsonUtils_1.JsonUtils.mapToJson(data))
            .then(function (response) { return JsonUtils_1.JsonUtils.jsonToMap(response.json); });
    };
    return ClientDataRepositoryImpl;
}());
exports.default = ClientDataRepositoryImpl;
//# sourceMappingURL=ClientDataRepositoryImpl.js.map