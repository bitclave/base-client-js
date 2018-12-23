import { AddrRecord } from './types/BaseTypes';
export declare enum WalletVerificationCodes {
    RC_OK = 0,
    RC_BASEID_MISSMATCH = -1,
    RC_ADDR_NOT_VERIFIED = -2,
    RC_ADDR_WRONG_SIGNATURE = -3,
    RC_ADDR_SCHEMA_MISSMATCH = -4,
    RC_GENERAL_ERROR = -100
}
export declare class WalletVerificationStatus {
    rc: WalletVerificationCodes;
    err: string;
    details: Array<number>;
}
export declare class WalletUtils {
    private static baseSchema;
    static verifyAddressRecord(record: AddrRecord): WalletVerificationCodes;
    static validateWallets(key: string, val: any, baseID: string): WalletVerificationStatus;
    static verifyWalletsRecord(baseID: string, msg: any): WalletVerificationStatus;
    static createEthereumAddersRecord(baseID: string, ethAddr: string, ethPrvKey: string): AddrRecord;
}
