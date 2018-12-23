"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TokenPointer = /** @class */ (function () {
    function TokenPointer(token, signature) {
        this.token = token;
        this.signature = signature;
    }
    TokenPointer.generateKey = function (bid, spid) {
        return bid + TokenPointer.SEP + spid;
    };
    TokenPointer.getBID = function (key) {
        return key.split(this.SEP)[0];
    };
    TokenPointer.getSPID = function (key) {
        return key.split(this.SEP)[1];
    };
    TokenPointer.conform = function (value) {
        try {
            var obj = JSON.parse(value);
            if (obj.token !== undefined && obj.signature !== undefined) {
                return Token.conform(obj.token);
            }
        }
        catch (e) {
            return false;
        }
        return false;
    };
    TokenPointer.SEP = '_';
    return TokenPointer;
}());
exports.TokenPointer = TokenPointer;
var Token = /** @class */ (function () {
    function Token(bid, nonce, dataHash, timestamp, transactionKey) {
        this.bid = bid;
        this.nonce = nonce;
        this.dataHash = dataHash;
        this.timestamp = timestamp;
        this.transactionKey = transactionKey;
    }
    Token.conform = function (obj) {
        if (obj.bid !== undefined && obj.nonce !== undefined && obj.dataHash !== undefined && obj.timestamp !== undefined && obj.transactionKey !== undefined) {
            return true;
        }
        return false;
    };
    return Token;
}());
exports.Token = Token;
//# sourceMappingURL=TokenPointer.js.map