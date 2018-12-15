"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpMethod_1 = require("./HttpMethod");
var InterceptorCortege = /** @class */ (function () {
    function InterceptorCortege(path, method, headers, data) {
        this.path = path;
        this.method = method;
        this.headers = headers;
        this.data = data;
    }
    InterceptorCortege.prototype.isTransaction = function () {
        return this.method == HttpMethod_1.HttpMethod.Delete ||
            this.method == HttpMethod_1.HttpMethod.Put ||
            this.method == HttpMethod_1.HttpMethod.Patch ||
            this.method == HttpMethod_1.HttpMethod.Post;
    };
    return InterceptorCortege;
}());
exports.InterceptorCortege = InterceptorCortege;
//# sourceMappingURL=InterceptorCortege.js.map