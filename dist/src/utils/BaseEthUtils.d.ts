import { MessageSigner } from "./keypair/MessageSigner";
export declare enum EthWalletVerificationCodes {
    RC_OK = 0,
    RC_BASEID_MISSMATCH = -1,
    RC_ETH_ADDR_NOT_VERIFIED = -2,
    RC_ETH_ADDR_WRONG_SIGNATURE = -3,
    RC_ETH_ADDR_SCHEMA_MISSMATCH = -4,
    RC_GENERAL_ERROR = -100,
}
export declare class EthWalletVerificationStatus {
    rc: EthWalletVerificationCodes;
    err: string;
    details: Array<number>;
}
export default class BaseEthUtils {
    static verifyEthAddrRecord(msg: any): EthWalletVerificationCodes;
    static createEthAddrRecord(baseID: string, ethAddr: string, ethPrvKey: string): any;
    static dbg_createEthWalletsRecord(baseID: string, signedEthRecords: Array<any>, prvKey: string): Promise<any>;
    static createEthWalletsRecord2(baseID: string, signedEthRecords: Array<any>, signer: MessageSigner): Promise<any>;
    static createEthWalletsRecord(baseID: string, signedEthRecords: Array<any>, prvKey: string): Promise<any>;
    static verifyEthWalletsRecord(baseID: string, msg: any): EthWalletVerificationStatus;
}
