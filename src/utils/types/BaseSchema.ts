const Ajv = require('ajv');

// todo need refactor this class!!!!
export class BaseSchema {

    public static BaseAddrPair: any = {
        'type': 'object',
        'properties': {
            'baseID': {'type': 'string'},
            'addr': {'type': 'string'}
        },
        'required': ['baseID', 'addr'],
        'additionalProperties': false
    };

    public static AddrRecord: any = {
        'type': 'object',
        'properties': {
            'data': {'type': 'string'},
            'sig': {
                'type': 'string'
            },
        },
        'required': ['data'],
        'additionalProperties': false
    };

    public static AddrRecord: any = {
        'type': 'object',
        'properties': {
            'data': {'type': 'string'},
            'sig': {
                'type': 'string'
            },
        },
        'required': ['data'],
        'additionalProperties': false
    };

    public static CryptoWallets: any = {
        'definitions': {
            'address': BaseSchema.AddrRecord
        },
        'description': 'list of crypto wallets',
        'type': 'object',
        'properties': {
            'data': {
                'type': 'array',
                'items': {'$ref': '#/definitions/address'},
                'minItems': 1,
                'uniqueItems': true
            },
            'sig': {
                'type': 'string'
            }
        }
    };

    public static All: any = {
        'title': 'Profile',
        'definitions': {
            'address': BaseSchema.AddrRecord,
            'wallets': BaseSchema.CryptoWallets
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
            'wallets': {'$ref': '#/definitions/wallets'},
        },
        'required': ['baseID'],
        'additionalProperties': false
    };

    private ajvValidateAll: Function;
    private ajvValidateAddr: Function;
    private ajvValidateBaseAddrPair: Function;
    private ajvValidateWallets: Function;

    private ajv: any;

    constructor() {
        this.ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

        this.ajvValidateBaseAddrPair = this.ajv.compile(BaseSchema.BaseAddrPair);
        this.ajvValidateAddr = this.ajv.compile(BaseSchema.AddrRecord);
        this.ajvValidateWallets = this.ajv.compile(BaseSchema.CryptoWallets);
        this.ajvValidateAll = this.ajv.compile(BaseSchema.All);
    }

    public validateAddr(s: any): boolean {
        return this.ajvValidateAddr(s);
    }

    public validateWallets(s: any): boolean {
        return this.ajvValidateWallets(s);
    }

    public validateBaseAddrPair(s: any): boolean {
        return this.ajvValidateBaseAddrPair(s);
    }

    public validateAll(s: any): boolean {
        return this.ajvValidateAll(s);
    }

}
