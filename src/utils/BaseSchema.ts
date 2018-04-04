const Ajv = require('ajv');

export default class BaseSchema {

    private static _validateAll: any;
    private static _validateEthAddr: any;
    private static _validateEthBaseAddrPair: any;
    private static _validateEthWallets: any;

    private static isInitialized: boolean = false;
    private static ajv: any;

    public static EthBaseAddrPair = {
        "type": "object",
        "properties" : {
            "baseID" : { "type": "string" },
            "ethAddr": { "type" : "string" }
        },
        "required": ["baseID", "ethAddr"],
        "additionalProperties": false
    }

    public static EthAddrRecord = {
        "type": "object",
        "properties": {
            "data": {"type": "string"},
            "sig": {
                "type": "string"
            },
        },
        "required": ["data"],
        "additionalProperties": false
    };

    public static EthWallets = {
        "definitions": {
            "eth_address": BaseSchema.EthAddrRecord
        },
        "description": "list of ETH wallets",
        "type": "object",
        "properties": {
            "data": {
                "type": "array",
                "items": {"$ref": "#/definitions/eth_address"},
                "minItems": 1,
                "uniqueItems": true
            },
            "sig": {
                "type": "string"
            }
        }
    };

    public static all = {
        "title": "Profile",
        "definitions": {
            "eth_address": BaseSchema.EthAddrRecord,
            "eth_wallets": BaseSchema.EthWallets
        },

        "type": "object",
        "properties": {
            "baseID": {
                "type": "string"
            },
            "email": {
                "type": "string"
            },
            "wealth": {
                "description": "wealth in USD",
                "type": "string"
            },
            "eth_wallets": {"$ref": "#/definitions/eth_wallets"},
        },
        "required": ["baseID"],
        "additionalProperties": false
    };



    public static getSchema(): any
    {
        BaseSchema.Init();
        return this;
    }

    public static Init()
    {
        if (BaseSchema.isInitialized) return;
        BaseSchema.isInitialized = true;

        BaseSchema.ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

        BaseSchema._validateEthBaseAddrPair = BaseSchema.ajv.compile(BaseSchema.EthBaseAddrPair);
        BaseSchema._validateEthAddr =  BaseSchema.ajv.compile(BaseSchema.EthAddrRecord);
        BaseSchema._validateEthWallets = BaseSchema.ajv.compile(BaseSchema.EthWallets);
        BaseSchema._validateAll = BaseSchema.ajv.compile(BaseSchema.all);
    }

    public static validateAll(s: any) : boolean
    {
        return BaseSchema._validateAll(s);
    }
    public static validateEthAddr(s: any) : boolean
    {
        return BaseSchema._validateEthAddr(s);
    }
    public static validateEthWallets(s: any) : boolean
    {
        return BaseSchema._validateEthWallets(s);
    }
    public static validateEthBaseAddrPair(s: any) : boolean
    {
        var valid = BaseSchema._validateEthBaseAddrPair(s);
        // if (valid) console.log('Valid!');
        // else console.log('Invalid: ' + BaseSchema.ajv.errorsText(BaseSchema._validateEthBaseAddrPair.errors));
        return valid;
    }
}
