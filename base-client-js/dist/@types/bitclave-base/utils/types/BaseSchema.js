"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ajv = require('ajv');
// todo need refactor this class!!!!
var BaseSchema = /** @class */ (function () {
    function BaseSchema() {
        this.ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
        this.ajvValidateBaseAddrPair = this.ajv.compile(BaseSchema.EthBaseAddrPair);
        this.ajvValidateAddr = this.ajv.compile(BaseSchema.EthAddrRecord);
        this.ajvValidateWallets = this.ajv.compile(BaseSchema.EthWallets);
        this.ajvValidateAll = this.ajv.compile(BaseSchema.All);
    }
    BaseSchema.prototype.validateAddr = function (s) {
        return this.ajvValidateAddr(s);
    };
    BaseSchema.prototype.validateWallets = function (s) {
        return this.ajvValidateWallets(s);
    };
    BaseSchema.prototype.validateBaseAddrPair = function (s) {
        return this.ajvValidateBaseAddrPair(s);
    };
    BaseSchema.prototype.validateAll = function (s) {
        return this.ajvValidateAll(s);
    };
    BaseSchema.EthBaseAddrPair = {
        'type': 'object',
        'properties': {
            'baseID': { 'type': 'string' },
            'ethAddr': { 'type': 'string' }
        },
        'required': ['baseID', 'ethAddr'],
        'additionalProperties': false
    };
    BaseSchema.EthAddrRecord = {
        'type': 'object',
        'properties': {
            'data': { 'type': 'string' },
            'sig': {
                'type': 'string'
            },
        },
        'required': ['data'],
        'additionalProperties': false
    };
    BaseSchema.EthWallets = {
        'definitions': {
            'eth_address': BaseSchema.EthAddrRecord
        },
        'description': 'list of ETH wallets',
        'type': 'object',
        'properties': {
            'data': {
                'type': 'array',
                'items': { '$ref': '#/definitions/eth_address' },
                'minItems': 1,
                'uniqueItems': true
            },
            'sig': {
                'type': 'string'
            }
        }
    };
    BaseSchema.All = {
        'title': 'Profile',
        'definitions': {
            'eth_address': BaseSchema.EthAddrRecord,
            'eth_wallets': BaseSchema.EthWallets
        },
        'type': 'object',
        'properties': {
            'baseID': {
                'type': 'string'
            },
            'email': {
                'type': 'string'
            },
            'wealth': {
                'description': 'wealth in USD',
                'type': 'string'
            },
            'eth_wallets': { '$ref': '#/definitions/eth_wallets' },
        },
        'required': ['baseID'],
        'additionalProperties': false
    };
    return BaseSchema;
}());
exports.BaseSchema = BaseSchema;
//# sourceMappingURL=BaseSchema.js.map