"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Response = /** @class */ (function () {
    function Response(json, status) {
        try {
            this._json = JSON.parse(json);
        }
        catch (e) {
            this._json = json;
        }
        this._status = status;
    }
    Object.defineProperty(Response.prototype, "json", {
        get: function () {
            return this._json;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    return Response;
}());
exports.Response = Response;
//# sourceMappingURL=Response.js.map