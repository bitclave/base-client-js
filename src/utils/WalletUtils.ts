import { MessageData } from 'eth-sig-util';
import { WalletManagerImpl } from '../manager/WalletManagerImpl';
import { EthereumUtils } from './EthereumUtils';
import { BaseSchema } from './types/BaseSchema';
import { AddrRecord, BaseAddrPair, WalletsRecords } from './types/BaseTypes';

const bitcore = require('bitcore-lib');
const Message = require('bitcore-message');

export enum WalletVerificationCodes {
    RC_OK = 0,
    RC_BASEID_MISSMATCH = -1,
    RC_ADDR_NOT_VERIFIED = -2,
    RC_ADDR_WRONG_SIGNATURE = -3,
    RC_ADDR_SCHEMA_MISSMATCH = -4,
    RC_GENERAL_ERROR = -100,
}

export class WalletVerificationStatus {
    public rc: WalletVerificationCodes = WalletVerificationCodes.RC_OK;
    public err: string = '';
    public details: Array<number> = [];
}

export class WalletUtils {

    private static baseSchema = new BaseSchema();

    public static verifyAddressRecord(record: AddrRecord): WalletVerificationCodes {
        let signerAddr: string;
        try {
            if (!this.baseSchema.validateAddr(record)) {
                return WalletVerificationCodes.RC_ADDR_SCHEMA_MISSMATCH;
            }

            if (!this.baseSchema.validateBaseAddrPair(record.data)) {
                return WalletVerificationCodes.RC_ADDR_SCHEMA_MISSMATCH;
            }

            if (record.sig.length > 0) {
                signerAddr = EthereumUtils.recoverPersonalSignature(record.getSignedMessage());
            } else {
                return WalletVerificationCodes.RC_ADDR_NOT_VERIFIED;
            }

        } catch (err) {
            return WalletVerificationCodes.RC_GENERAL_ERROR;
        }

        return (signerAddr === record.data.ethAddr)
               ? WalletVerificationCodes.RC_OK
               : WalletVerificationCodes.RC_ADDR_WRONG_SIGNATURE;
    }

    public static validateWallets(
        key: string,
        walletsRecords: WalletsRecords,
        baseID: string
    ): WalletVerificationStatus {
        const result: WalletVerificationStatus = new WalletVerificationStatus();

        if (key !== WalletManagerImpl.DATA_KEY_ETH_WALLETS) {
            result.err = 'The \<key\> is expected to be "' + WalletManagerImpl.DATA_KEY_ETH_WALLETS + '"';
            result.rc = WalletVerificationCodes.RC_GENERAL_ERROR;

            return result;
        }

        return this.verifyWalletsRecord(baseID, walletsRecords);
    }

    public static verifyWalletsRecord(baseID: string, walletsRecords: WalletsRecords): WalletVerificationStatus {
        const status: WalletVerificationStatus = new WalletVerificationStatus();
        status.rc = WalletVerificationCodes.RC_OK;

        if (!this.baseSchema.validateWallets(walletsRecords)) {
            status.rc = WalletVerificationCodes.RC_ADDR_SCHEMA_MISSMATCH;
            return status;
        }

        // verify all baseID keys are the same in ETH records
        for (const item of walletsRecords.data) {
            const pubKey = item.data.baseID;
            if (pubKey !== baseID) {
                status.details.push(WalletVerificationCodes.RC_BASEID_MISSMATCH);

            } else if (this.verifyAddressRecord(item) !== WalletVerificationCodes.RC_OK) {
                status.details.push(this.verifyAddressRecord(item));

            } else {
                status.details.push(WalletVerificationCodes.RC_OK);
            }
        }

        // verify signature matches the baseID
        const baseAddr = bitcore.PublicKey.fromString(baseID).toAddress().toString(16);
        let sigCheck = false;

        try {
            if (walletsRecords.sig.length > 0) {
                const message: Array<MessageData> = walletsRecords.data.map(item => item.getMessage());
                sigCheck = Message(JSON.stringify(message)).verify(baseAddr, walletsRecords.sig);
                if (!sigCheck) {
                    status.rc = WalletVerificationCodes.RC_ADDR_WRONG_SIGNATURE;
                    status.err = `Wallet signature does not match baseID ${baseID}`;
                }
            } else {
                status.rc = WalletVerificationCodes.RC_ADDR_NOT_VERIFIED;
                status.err = `Wallet signature is missing`;
            }
        } catch (err) {
            status.rc = WalletVerificationCodes.RC_GENERAL_ERROR;
            status.err = `General error while verifying Wallet signature`;
        }

        return status;
    }

    public static createEthereumAddersRecord(baseID: string, ethAddr: string, ethPrvKey: string): AddrRecord {
        const record: AddrRecord = new AddrRecord(
            new BaseAddrPair(baseID, ethAddr),
            ''
        );

        return new AddrRecord(record.data, EthereumUtils.createSig(ethPrvKey, record.getMessage()));
    }

}
