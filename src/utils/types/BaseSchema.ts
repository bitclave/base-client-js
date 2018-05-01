const Ajv = require('ajv');

// todo need refactor this class!!!!
export class BaseSchema {

    public static EthBaseAddrPair: any = {
        'type': 'object',
        'properties': {
            'baseID': {'type': 'string'},
            'ethAddr': {'type': 'string'}
        },
        'required': ['baseID', 'ethAddr'],
        'additionalProperties': false
    };

    public static EthAddrRecord: any = {
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

    public static EthWallets: any = {
        'definitions': {
            'eth_address': BaseSchema.EthAddrRecord
        },
        'description': 'list of ETH wallets',
        'type': 'object',
        'properties': {
            'data': {
                'type': 'array',
                'items': {'$ref': '#/definitions/eth_address'},
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
            'eth_wallets': {'$ref': '#/definitions/eth_wallets'},
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

        this.ajvValidateBaseAddrPair = this.ajv.compile(BaseSchema.EthBaseAddrPair);
        this.ajvValidateAddr = this.ajv.compile(BaseSchema.EthAddrRecord);
        this.ajvValidateWallets = this.ajv.compile(BaseSchema.EthWallets);
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
