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
    static CryptoWallets: {
        'definitions': {
            'address': {
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
            'address': {
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
            'wallets': {
                'definitions': {
                    'address': {
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
            'wallets': {
                '$ref': string;
            };
        };
        'required': string[];
        'additionalProperties': boolean;
    };
    static getInstance(): BaseSchema;
    private ajvValidateAll;
    private ajvValidateAddr;
    private ajvValidateBaseAddrPair;
    private ajvValidateWallets;
    private ajv;
    constructor();
    validateAddr(s: any): boolean;
    validateWallets(s: any): boolean;
    validateBaseAddrPair(s: any): boolean;
    validateAll(s: any): boolean;
}
