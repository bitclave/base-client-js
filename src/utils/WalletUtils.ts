import { BaseSchema } from './types/BaseSchema';
import { EthAddrRecord, EthBaseAddrPair, BtcAddrRecord, BtcBaseAddrPair } from './types/BaseTypes';
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

    public static verifyEthAddressRecord(record: EthAddrRecord): WalletVerificationCodes {
        let signerEthAddr: string;
        try {
            if (!this.baseSchema.validateEthAddr(record)) {
                return WalletVerificationCodes.RC_ADDR_SCHEMA_MISSMATCH;
            }

            if (!this.baseSchema.validateEthBaseAddrPair(JSON.parse(record.data))) {
                return WalletVerificationCodes.RC_ADDR_SCHEMA_MISSMATCH;
            }

            if (record.sig.length > 0) {
                signerEthAddr = EthereumUtils.recoverSignerEthereumAddress(record);
            } else {
                return WalletVerificationCodes.RC_ADDR_NOT_VERIFIED;
            }

        } catch (err) {
            return WalletVerificationCodes.RC_GENERAL_ERROR;
        }

        return (signerEthAddr == JSON.parse(record.data).ethAddr)
            ? WalletVerificationCodes.RC_OK
            : WalletVerificationCodes.RC_ADDR_WRONG_SIGNATURE;
    }

    public static verifyBtcAddressRecord(record: BtcAddrRecord): WalletVerificationCodes {
        let signerBtcAddr: string;
        try {
            if (!this.baseSchema.validateBtcAddr(record)) {
                return WalletVerificationCodes.RC_ADDR_SCHEMA_MISSMATCH;
            }

            if (!this.baseSchema.validateBtcBaseAddrPair(JSON.parse(record.data))) {
                return WalletVerificationCodes.RC_ADDR_SCHEMA_MISSMATCH;
            }

            if (record.sig.length > 0) {
                signerBtcAddr = EthereumUtils.recoverPersonalSignatureBTC(record);
            } else {
                return WalletVerificationCodes.RC_ADDR_NOT_VERIFIED;
            }

        } catch (err) {
            return WalletVerificationCodes.RC_GENERAL_ERROR;
        }

        return (signerBtcAddr == JSON.parse(record.data).btcAddr)
            ? WalletVerificationCodes.RC_OK
            : WalletVerificationCodes.RC_ADDR_WRONG_SIGNATURE;
    }

    public static validateEthWallets(key: string, val: any, baseID: string): WalletVerificationStatus {
        const result: WalletVerificationStatus = new WalletVerificationStatus();

        if (key != WalletManagerImpl.DATA_KEY_ETH_WALLETS) {
            result.err = 'The \<key\> is expected to be "' + WalletManagerImpl.DATA_KEY_ETH_WALLETS + '"';
            result.rc = WalletVerificationCodes.RC_GENERAL_ERROR;

            return result;
        }

        return this.verifyEthWalletsRecord(baseID, val);
    }

    public static validateBtcWallets(key: string, val: any, baseID: string): WalletVerificationStatus {
        const result: WalletVerificationStatus = new WalletVerificationStatus();

        if (key != WalletManagerImpl.DATA_KEY_BTC_WALLETS) {
            result.err = 'The \<key\> is expected to be "' + WalletManagerImpl.DATA_KEY_BTC_WALLETS + '"';
            result.rc = WalletVerificationCodes.RC_GENERAL_ERROR;

            return result;
        }

        return this.verifyBtcWalletsRecord(baseID, val);
    }

    public static verifyEthWalletsRecord(baseID: string, msg: any): WalletVerificationStatus {
        let resultCode: WalletVerificationCodes;
        const status: WalletVerificationStatus = new WalletVerificationStatus();
        status.rc = WalletVerificationCodes.RC_OK;

        if (!this.baseSchema.validateEthWallets(msg)) {
            status.rc = WalletVerificationCodes.RC_ADDR_SCHEMA_MISSMATCH;
            return status;
        }

        // verify all baseID keys are the same in ETH records
        for (let item of msg.data) {
            const pubKey = JSON.parse(item.data).baseID;
            if (pubKey != baseID) {
                status.details.push(WalletVerificationCodes.RC_BASEID_MISSMATCH);

            } else if ((resultCode = this.verifyEthAddressRecord(item)) != WalletVerificationCodes.RC_OK) {
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

    public static verifyBtcWalletsRecord(baseID: string, msg: any): WalletVerificationStatus {
        let resultCode: WalletVerificationCodes;
        const status: WalletVerificationStatus = new WalletVerificationStatus();
        status.rc = WalletVerificationCodes.RC_OK;

        if (!this.baseSchema.validateBtcWallets(msg)) {
            status.rc = WalletVerificationCodes.RC_ADDR_SCHEMA_MISSMATCH;
            return status;
        }

        // verify all baseID keys are the same in ETH records
        for (let item of msg.data) {
            const pubKey = JSON.parse(item.data).baseID;
            if (pubKey != baseID) {
                status.details.push(WalletVerificationCodes.RC_BASEID_MISSMATCH);

            } else if ((resultCode = this.verifyBtcAddressRecord(item)) != WalletVerificationCodes.RC_OK) {
                status.details.push(resultCode);

            } else {
                status.details.push(WalletVerificationCodes.RC_OK);
            }
        }

        // verify signature matches the baseID
        const baseAddr = bitcore.PublicKey.fromString(baseID).toAddress().toString();
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

    public static createEthereumAddersRecord(baseID: string, ethAddr: string, ethPrvKey: string): EthAddrRecord {
        const record: EthAddrRecord = new EthAddrRecord(
            JSON.stringify(new EthBaseAddrPair(baseID, ethAddr)),
            ''
        );
        record.sig = EthereumUtils.createSig(ethPrvKey, record);

        return record;
    }

    public static createBitcoinAddersRecord(baseID: string, btcAddr: string, btcPrvKey: string): EthAddrRecord {
        const record: BtcAddrRecord = new BtcAddrRecord(
            JSON.stringify(new BtcBaseAddrPair(baseID, btcAddr)),
            ''
        );
        record.sig = EthereumUtils.createSig(btcPrvKey, record);

        return record;
    }

}
