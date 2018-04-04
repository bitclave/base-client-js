export default class BaseSchema {
    private static _validateAll;
    private static _validateEthAddr;
    private static _validateEthBaseAddrPair;
    private static _validateEthWallets;
    private static isInitialized;
    private static ajv;
    static EthBaseAddrPair: {
        "type": string;
        "properties": {
            "baseID": {
                "type": string;
            };
            "ethAddr": {
                "type": string;
            };
        };
        "required": string[];
        "additionalProperties": boolean;
    };
    static EthAddrRecord: {
        "type": string;
        "properties": {
            "data": {
                "type": string;
            };
            "sig": {
                "type": string;
            };
        };
        "required": string[];
        "additionalProperties": boolean;
    };
    static EthWallets: {
        "definitions": {
            "eth_address": {
                "type": string;
                "properties": {
                    "data": {
                        "type": string;
                    };
                    "sig": {
                        "type": string;
                    };
                };
                "required": string[];
                "additionalProperties": boolean;
            };
        };
        "description": string;
        "type": string;
        "properties": {
            "data": {
                "type": string;
                "items": {
                    "$ref": string;
                };
                "minItems": number;
                "uniqueItems": boolean;
            };
            "sig": {
                "type": string;
            };
        };
    };
    static all: {
        "title": string;
        "definitions": {
            "eth_address": {
                "type": string;
                "properties": {
                    "data": {
                        "type": string;
                    };
                    "sig": {
                        "type": string;
                    };
                };
                "required": string[];
                "additionalProperties": boolean;
            };
            "eth_wallets": {
                "definitions": {
                    "eth_address": {
                        "type": string;
                        "properties": {
                            "data": {
                                "type": string;
                            };
                            "sig": {
                                "type": string;
                            };
                        };
                        "required": string[];
                        "additionalProperties": boolean;
                    };
                };
                "description": string;
                "type": string;
                "properties": {
                    "data": {
                        "type": string;
                        "items": {
                            "$ref": string;
                        };
                        "minItems": number;
                        "uniqueItems": boolean;
                    };
                    "sig": {
                        "type": string;
                    };
                };
            };
        };
        "type": string;
        "properties": {
            "baseID": {
                "type": string;
            };
            "email": {
                "type": string;
            };
            "wealth": {
                "description": string;
                "type": string;
            };
            "eth_wallets": {
                "$ref": string;
            };
        };
        "required": string[];
        "additionalProperties": boolean;
    };
    static getSchema(): any;
    static Init(): void;
    static validateAll(s: any): boolean;
    static validateEthAddr(s: any): boolean;
    static validateEthWallets(s: any): boolean;
    static validateEthBaseAddrPair(s: any): boolean;
}
