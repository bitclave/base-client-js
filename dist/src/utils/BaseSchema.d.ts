export declare class BaseSchema {
    private static instance;
    static BaseAddrPair: {
        'type': string;
        'properties': {
            'baseID': {
                'type': string;
            };
            'addr': {
                'type': string;
            };
        };
        'required': string[];
        'additionalProperties': boolean;
    };
    static AddrRecord: {
        'type': string;
        'properties': {
            'data': {
                'type': string;
            };
            'sig': {
                'type': string;
            };
        };
        'required': string[];
        'additionalProperties': boolean;
    };
    static EthWallets: {
        'definitions': {
            'eth_address': {
                'type': string;
                'properties': {
                    'data': {
                        'type': string;
                    };
                    'sig': {
                        'type': string;
                    };
                };
                'required': string[];
                'additionalProperties': boolean;
            };
        };
        'description': string;
        'type': string;
        'properties': {
            'data': {
                'type': string;
                'items': {
                    '$ref': string;
                };
                'minItems': number;
                'uniqueItems': boolean;
            };
            'sig': {
                'type': string;
            };
        };
    };
    static All: {
        'title': string;
        'definitions': {
            'eth_address': {
                'type': string;
                'properties': {
                    'data': {
                        'type': string;
                    };
                    'sig': {
                        'type': string;
                    };
                };
                'required': string[];
                'additionalProperties': boolean;
            };
            'eth_wallets': {
                'definitions': {
                    'eth_address': {
                        'type': string;
                        'properties': {
                            'data': {
                                'type': string;
                            };
                            'sig': {
                                'type': string;
                            };
                        };
                        'required': string[];
                        'additionalProperties': boolean;
                    };
                };
                'description': string;
                'type': string;
                'properties': {
                    'data': {
                        'type': string;
                        'items': {
                            '$ref': string;
                        };
                        'minItems': number;
                        'uniqueItems': boolean;
                    };
                    'sig': {
                        'type': string;
                    };
                };
            };
        };
        'type': string;
        'properties': {
            'baseID': {
                'type': string;
            };
            'email': {
                'type': string;
            };
            'wealth': {
                'description': string;
                'type': string;
            };
            'eth_wallets': {
                '$ref': string;
            };
        };
        'required': string[];
        'additionalProperties': boolean;
    };
    static getInstance(): BaseSchema;
    private ajvValidateAll;
    private ajvValidateEthAddr;
    private ajvValidateEthBaseAddrPair;
    private ajvValidateEthWallets;
    private ajv;
    constructor();
    validateEthAddr(s: any): boolean;
    validateEthWallets(s: any): boolean;
    validateEthBaseAddrPair(s: any): boolean;
    validateAll(s: any): boolean;
}
