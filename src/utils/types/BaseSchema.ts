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

    public static BtcBaseAddrPair: any = {
        'type': 'object',
        'properties': {
            'baseID': {'type': 'string'},
            'btcAddr': {'type': 'string'}
        },
        'required': ['baseID', 'btcAddr'],
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

    public static BtcAddrRecord: any = {
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

    public static BtcWallets: any = {
        'definitions': {
            'btc_address': BaseSchema.BtcAddrRecord
        },
        'description': 'list of BTC wallets',
        'type': 'object',
        'properties': {
            'data': {
                'type': 'array',
                'items': {'$ref': '#/definitions/btc_address'},
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
            'eth_wallets': BaseSchema.EthWallets,
            'btc_wallets': BaseSchema.BtcWallets
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
    private ajvValidateEthAddr: Function;
    private ajvValidateEthBaseAddrPair: Function;
    private ajvValidateEthWallets: Function;
    private ajvValidateBtcAddr: Function;
    private ajvValidateBtcBaseAddrPair: Function;
    private ajvValidateBtcWallets: Function;

    private ajv: any;

    constructor() {
        this.ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

        this.ajvValidateEthBaseAddrPair = this.ajv.compile(BaseSchema.EthBaseAddrPair);
        this.ajvValidateEthAddr = this.ajv.compile(BaseSchema.EthAddrRecord);
        this.ajvValidateEthWallets = this.ajv.compile(BaseSchema.EthWallets);
        this.ajvValidateBtcBaseAddrPair = this.ajv.compile(BaseSchema.BtcBaseAddrPair);
        this.ajvValidateBtcAddr = this.ajv.compile(BaseSchema.BtcAddrRecord);
        this.ajvValidateBtcWallets = this.ajv.compile(BaseSchema.BtcWallets);
        this.ajvValidateAll = this.ajv.compile(BaseSchema.All);
    }

    public validateEthAddr(s: any): boolean {
        return this.ajvValidateEthAddr(s);
    }

    public validateEthWallets(s: any): boolean {
        return this.ajvValidateEthWallets(s);
    }

    public validateEthBaseAddrPair(s: any): boolean {
        return this.ajvValidateEthBaseAddrPair(s);
    }

    public validateBtcAddr(s: any): boolean {
        return this.ajvValidateBtcAddr(s);
    }

    public validateBtcWallets(s: any): boolean {
        return this.ajvValidateBtcWallets(s);
    }

    public validateBtcBaseAddrPair(s: any): boolean {
        return this.ajvValidateBtcBaseAddrPair(s);
    }

    public validateAll(s: any): boolean {
        return this.ajvValidateAll(s);
    }

}
