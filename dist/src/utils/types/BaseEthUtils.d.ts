import { AddrRecord, EthWallets } from './BaseTypes';
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
    static verifyEthAddrRecord(msg: AddrRecord): EthWalletVerificationCodes;
    static createEthAddrRecord(baseID: string, addr: string, ethPrvKey: string): AddrRecord;
    static createEthWalletsRecordWithSigner(baseID: string, signedEthRecords: Array<AddrRecord>, signer: MessageSigner): Promise<EthWallets>;
    static verifyEthWalletsRecord(baseID: string, msg: any): EthWalletVerificationStatus;
}
