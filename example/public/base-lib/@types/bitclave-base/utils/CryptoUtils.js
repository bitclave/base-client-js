"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CryptoJS = require('crypto-js');
var CryptoUtils = /** @class */ (function () {
    function CryptoUtils() {
    }
    CryptoUtils.keccak256 = function (message) {
        var array = CryptoJS.SHA3(message, { outputLength: 256 });
        return array.toString(CryptoJS.enc.Hex);
    };
    CryptoUtils.sha384 = function (message) {
        var array = CryptoJS.SHA384(message);
        return array.toString(CryptoJS.enc.Hex);
    };
    CryptoUtils.encryptAes256 = function (message, pass) {
        var ciphertext = CryptoJS.AES.encrypt(message, pass, { outputLength: 256 });
        return ciphertext.toString();
    };
    CryptoUtils.decryptAes256 = function (ciphertext, pass) {
        var bytes = CryptoJS.AES.decrypt(ciphertext, pass, { outputLength: 256 });
        return bytes.toString(CryptoJS.enc.Utf8);
    };
    CryptoUtils.PBKDF2 = function (password, keySize) {
        return CryptoJS.PBKDF2(password, CryptoUtils.sha384(CryptoUtils.sha384(password)), { keySize: keySize / 32, iterations: 100 }).toString(CryptoJS.enc.Hex);
    };
    return CryptoUtils;
}());
exports.CryptoUtils = CryptoUtils;
//# sourceMappingURL=CryptoUtils.js.map