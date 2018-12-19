"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsonUtils = /** @class */ (function () {
    function JsonUtils() {
    }
    JsonUtils.jsonToMap = function (json) {
        var map = new Map();
        Object.keys(json).forEach(function (key) { return map.set(key, json[key]); });
        return map;
    };
    JsonUtils.mapToJson = function (map) {
        var result = {};
        map.forEach(function (value, key) {
            result[key] = value;
        });
        return result;
    };
    return JsonUtils;
}());
exports.JsonUtils = JsonUtils;
//# sourceMappingURL=JsonUtils.js.map