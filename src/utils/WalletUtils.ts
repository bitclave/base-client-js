import { BaseSchema } from './types/BaseSchema';
import { AddrRecord, BaseAddrPair } from './types/BaseTypes';
import { EthereumUtils } from './EthereumUtils';
import { WalletManagerImpl } from '../manager/WalletManagerImpl';

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

            if (!this.baseSchema.validateBaseAddrPair(JSON.parse(record.data))) {
                return WalletVerificationCodes.RC_ADDR_SCHEMA_MISSMATCH;
            }

            if (record.sig.length > 0) {
                signerAddr = EthereumUtils.recoverPersonalSignature(record);
            } else {
                return WalletVerificationCodes.RC_ADDR_NOT_VERIFIED;
            }

        } catch (err) {
            return WalletVerificationCodes.RC_GENERAL_ERROR;
        }

        return (signerAddr == JSON.parse(record.data).ethAddr)
            ? WalletVerificationCodes.RC_OK
            : WalletVerificationCodes.RC_ADDR_WRONG_SIGNATURE;
    }

    public static validateWallets(key: string, val: any, baseID: string): WalletVerificationStatus {
        const result: WalletVerificationStatus = new WalletVerificationStatus();

        if (key != WalletManagerImpl.DATA_KEY_ETH_WALLETS) {
            result.err = 'The \<key\> is expected to be "' + WalletManagerImpl.DATA_KEY_ETH_WALLETS + '"';
            result.rc = WalletVerificationCodes.RC_GENERAL_ERROR;

            return result;
        }

        return this.verifyWalletsRecord(baseID, val);
    }

    public static verifyWalletsRecord(baseID: string, msg: any): WalletVerificationStatus {
        let resultCode: WalletVerificationCodes;
        const status: WalletVerificationStatus = new WalletVerificationStatus();
        status.rc = WalletVerificationCodes.RC_OK;

        if (!this.baseSchema.validateWallets(msg)) {
            status.rc = WalletVerificationCodes.RC_ADDR_SCHEMA_MISSMATCH;
            return status;
        }

        // verify all baseID keys are the same in ETH records
        for (let item of msg.data) {
            const pubKey = JSON.parse(item.data).baseID;
            if (pubKey != baseID) {
                status.details.push(WalletVerificationCodes.RC_BASEID_MISSMATCH);

            } else if ((resultCode = this.verifyAddressRecord(item)) != WalletVerificationCodes.RC_OK) {
                status.details.push(resultCode);

            } else {
                status.details.push(WalletVerificationCodes.RC_OK);
            }
        }

        // verify signature matches the baseID
        const baseAddr = bitcore.PublicKey.fromString(baseID).toAddress().toString(16);
        let sigCheck = false;

        try {
            if (msg.sig.length > 0) {
                sigCheck = Message(JSON.stringify(msg.data)).verify(baseAddr, msg.sig);
                if (!sigCheck)
                    status.rc = WalletVerificationCodes.RC_ADDR_WRONG_SIGNATURE;
            } else {
                status.rc = WalletVerificationCodes.RC_ADDR_NOT_VERIFIED;
            }
        } catch (err) {
            status.rc = WalletVerificationCodes.RC_GENERAL_ERROR;
        }

        return status;
    }

    public static createEthereumAddersRecord(baseID: string, ethAddr: string, ethPrvKey: string): AddrRecord {
        const record: AddrRecord = new AddrRecord(
            JSON.stringify(new BaseAddrPair(baseID, ethAddr)),
            ''
        );
        record.sig = EthereumUtils.createSig(ethPrvKey, record);

        return record;
    }

}
