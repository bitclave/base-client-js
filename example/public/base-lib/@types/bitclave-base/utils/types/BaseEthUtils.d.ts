import { EthAddrRecord, EthWallets } from './BaseTypes';
import { MessageSigner } from '../keypair/MessageSigner';
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
    static verifyEthAddrRecord(msg: EthAddrRecord): EthWalletVerificationCodes;
    static createEthAddrRecord(baseID: string, ethAddr: string, ethPrvKey: string): EthAddrRecord;
    static createEthWalletsRecordWithSigner(baseID: string, signedEthRecords: Array<EthAddrRecord>, signer: MessageSigner): Promise<EthWallets>;
    static verifyEthWalletsRecord(baseID: string, msg: any): EthWalletVerificationStatus;
}
