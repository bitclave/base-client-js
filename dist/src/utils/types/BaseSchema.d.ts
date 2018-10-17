export declare class BaseSchema {
    static EthBaseAddrPair: any;
    static EthAddrRecord: any;
    static EthWallets: any;
    static All: any;
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
