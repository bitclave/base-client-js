const Ajv = require('ajv');

export default class BaseSchema {

    private static instance: BaseSchema | null = null;

    public static EthBaseAddrPair = {
        'type': 'object',
        'properties': {
            'baseID': {'type': 'string'},
            'ethAddr': {'type': 'string'}
        },
        'required': ['baseID', 'ethAddr'],
        'additionalProperties': false
    };

    public static EthAddrRecord = {
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

    public static EthWallets = {
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

    public static All = {
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

    public static getInstance(): BaseSchema {
        if (BaseSchema.instance == null) {
            BaseSchema.instance = new BaseSchema();
        }

        return BaseSchema.instance;
    }

    private ajvValidateAll: Function;
    private ajvValidateEthAddr: Function;
    private ajvValidateEthBaseAddrPair: Function;
    private ajvValidateEthWallets: Function;

    private ajv: any;

    constructor() {
        this.ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

        this.ajvValidateEthBaseAddrPair = this.ajv.compile(BaseSchema.EthBaseAddrPair);
        this.ajvValidateEthAddr = this.ajv.compile(BaseSchema.EthAddrRecord);
        this.ajvValidateEthWallets = this.ajv.compile(BaseSchema.EthWallets);
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

    public validateAll(s: any): boolean {
        return this.ajvValidateAll(s);
    }

}
