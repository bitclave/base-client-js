"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Permissions = /** @class */ (function () {
    function Permissions(fields) {
        if (fields === void 0) { fields = new Map(); }
        this.fields = fields;
    }
    return Permissions;
}());
exports.Permissions = Permissions;
var AccessRight;
(function (AccessRight) {
    AccessRight[AccessRight["R"] = 0] = "R";
    AccessRight[AccessRight["RW"] = 1] = "RW";
})(AccessRight = exports.AccessRight || (exports.AccessRight = {}));
//# sourceMappingURL=Permissions.js.map