"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpMethod_1 = require("../source/http/HttpMethod");
var Site_1 = require("../models/Site");
var SiteRepositoryImpl = /** @class */ (function () {
    function SiteRepositoryImpl(transport) {
        this.GET_SITE_DATA_API = '/v1/site/{origin}';
        this.transport = transport;
    }
    SiteRepositoryImpl.prototype.getSiteData = function (origin) {
        return this.transport.sendRequest(this.GET_SITE_DATA_API.replace('{origin}', origin), HttpMethod_1.HttpMethod.Get).then(function (response) { return Object.assign(new Site_1.Site(), response.json); });
    };
    return SiteRepositoryImpl;
}());
exports.SiteRepositoryImpl = SiteRepositoryImpl;
//# sourceMappingURL=SiteRepositoryImpl.js.map