"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Site = /** @class */ (function () {
    function Site(id, origin, publicKey, confidential) {
        if (id === void 0) { id = 0; }
        if (origin === void 0) { origin = ''; }
        if (publicKey === void 0) { publicKey = ''; }
        if (confidential === void 0) { confidential = false; }
        this.id = id;
        this.origin = origin;
        this.publicKey = publicKey;
        this.confidential = confidential;
    }
    return Site;
}());
exports.Site = Site;
//# sourceMappingURL=Site.js.map