"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsonUtils_1 = require("../../utils/JsonUtils");
var SearchRequest = /** @class */ (function () {
    function SearchRequest(tags) {
        if (tags === void 0) { tags = new Map(); }
        this.id = 0;
        this.owner = '0x0';
        this.tags = tags;
    }
    SearchRequest.fromJson = function (json) {
        var searchRequest = Object.assign(new SearchRequest(), json);
        searchRequest.tags = JsonUtils_1.JsonUtils.jsonToMap(json.tags);
        return searchRequest;
    };
    SearchRequest.prototype.toJson = function () {
        var jsonStr = JSON.stringify(this);
        var json = JSON.parse(jsonStr);
        json.tags = JsonUtils_1.JsonUtils.mapToJson(this.tags);
        return json;
    };
    return SearchRequest;
}());
exports.default = SearchRequest;
//# sourceMappingURL=SearchRequest.js.map