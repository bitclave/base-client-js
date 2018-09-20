"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataRequest = /** @class */ (function () {
    function DataRequest(toPk, requestData, responseData) {
        if (toPk === void 0) { toPk = ''; }
        if (requestData === void 0) { requestData = ''; }
        if (responseData === void 0) { responseData = ''; }
        this.id = 0;
        this.fromPk = '';
        this.toPk = '';
        this.requestData = '';
        this.responseData = '';
        this.toPk = toPk;
        this.requestData = requestData;
        this.responseData = responseData;
    }
    return DataRequest;
}());
exports.default = DataRequest;
//# sourceMappingURL=DataRequest.js.map