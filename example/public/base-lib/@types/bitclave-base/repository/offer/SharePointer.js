"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SharePointer = /** @class */ (function () {
    function SharePointer(token, data) {
        this.tokenPointer = token;
        this.data = data;
    }
    SharePointer.generateKey = function (uid, bid) {
        return uid + this.SEP + bid;
    };
    SharePointer.SEP = '_';
    return SharePointer;
}());
exports.default = SharePointer;
//# sourceMappingURL=SharePointer.js.map