"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Object represents the data entry stored at name service:
 * {type: [spid1, spid2, spid3...]}
 */
var ServiceType = /** @class */ (function () {
    function ServiceType(type) {
        this.type = type;
        this.spids = new Array();
    }
    return ServiceType;
}());
exports.default = ServiceType;
//# sourceMappingURL=ServiceType.js.map