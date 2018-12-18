"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var storage;
if (typeof localStorage === 'undefined' || localStorage === null) {
    var nodeStorage = require('node-localstorage').LocalStorage;
    storage = new nodeStorage('./scratch');
}
else {
    storage = localStorage;
}
var LocalStorageImpl = /** @class */ (function () {
    function LocalStorageImpl() {
    }
    LocalStorageImpl.prototype.setItem = function (key, value) {
        storage.setItem(key, value);
    };
    LocalStorageImpl.prototype.getItem = function (key) {
        return storage.getItem(key);
    };
    return LocalStorageImpl;
}());
exports.default = LocalStorageImpl;
//# sourceMappingURL=LocalStorageImpl.js.map