import { AddrRecord, BaseAddrPair, WalletsRecords } from '../../src/utils/types/BaseTypes';
import { BaseSchema } from '../../src/utils/types/BaseSchema';
import { WalletUtils, WalletVerificationCodes } from '../../src/utils/WalletUtils';

const Message = require('bitcore-message');
const bitcore = require('bitcore-lib');

const sigUtil = require('eth-sig-util');
const baseSchema = new BaseSchema();

export default class BaseEthUtils {

    public static createEthAddrRecord(baseID: string, ethAddr: string, ethPrvKey: string): AddrRecord {
        const record: AddrRecord = new AddrRecord(
            JSON.stringify(new BaseAddrPair(baseID, ethAddr)),
            ''
        );
        record.sig = sigUtil.personalSign(Buffer.from(ethPrvKey, 'hex'), record);

        return record;
    }

    public static async createEthWalletsRecordDebug(baseID: string, signedEthRecords: Array<AddrRecord>,
                                                    prvKey: string): Promise<WalletsRecords> {
        // no verification is performed here
        const msgWallets: WalletsRecords = new WalletsRecords(signedEthRecords, '');

        const privateKey = new bitcore.PrivateKey(bitcore.crypto.BN.fromString(prvKey, 16));
        const message = new Message(JSON.stringify(msgWallets.data));

        msgWallets.sig = message.sign(privateKey);

        return msgWallets;
    }

    public static async createEthWalletsRecordWithSigner(baseID: string, signedRecords: Array<AddrRecord>,
                                                         privKey: string): Promise<WalletsRecords> {
        for (let record of signedRecords) {
            if ((WalletUtils.verifyAddressRecord(record) !== WalletVerificationCodes.RC_OK) &&
                (WalletUtils.verifyAddressRecord(record) !== WalletVerificationCodes.RC_ADDR_NOT_VERIFIED)) {
                throw 'invalid eth record: ' + record;
            }

            if (baseID !== JSON.parse(record.data).baseID) {
                throw 'baseID missmatch';
            }
        }

        const walletsRecords: WalletsRecords = new WalletsRecords(signedRecords, '');

        if (!baseSchema.validateWallets(walletsRecords)) {
            throw 'invalid wallets structure';
        }

        // eth style signing
        // msgWallets.sig = sigUtil.personalSign(Buffer.from(prvKey, 'hex'), msgWallets);
        // var signerAddr = sigUtil.recoverPersonalSignature(msgWallets)

        // BASE Style signing
        const privateKey = new bitcore.PrivateKey(bitcore.crypto.BN.fromString(privKey, 16));
        const message = new Message(JSON.stringify(walletsRecords.data));

        walletsRecords.sig = message.sign(privateKey);

        return walletsRecords;
    }

    public static verifyWalletsRecord(baseID: string, msg: any): EthWalletVerificationStatus {
        let resultCode: EthWalletVerificationCodes;
        const status: EthWalletVerificationStatus = new EthWalletVerificationStatus();
        status.rc = EthWalletVerificationCodes.RC_OK;

        if (!baseSchema.validateEthWallets(msg)) {
            status.rc = EthWalletVerificationCodes.RC_ETH_ADDR_SCHEMA_MISSMATCH;
            return status;
        }

        const basePubKey = baseID;

        // verify all baseID keys are the same in ETH records
        for (let item of msg.data) {
            const pubKey = JSON.parse(item.data).baseID;
            if (pubKey !== basePubKey) {
                status.details.push(EthWalletVerificationCodes.RC_BASEID_MISSMATCH);

            } else if ((resultCode = this.verifyEthAddrRecord(item)) !== EthWalletVerificationCodes.RC_OK) {
                status.details.push(resultCode);

            } else {
                status.details.push(EthWalletVerificationCodes.RC_OK);
            }
        }

        // verify signature matches the baseID
        const baseAddr = new bitcore.PublicKey.fromString(basePubKey).toAddress().toString(16);
        let sigCheck = false;

        try {
            if (msg.sig.length > 0) {
                sigCheck = Message(JSON.stringify(msg.data)).verify(baseAddr, msg.sig);
                if (!sigCheck) {
                    status.rc = EthWalletVerificationCodes.RC_ETH_ADDR_WRONG_SIGNATURE;
                }
            } else {
                status.rc = EthWalletVerificationCodes.RC_ETH_ADDR_NOT_VERIFIED;
            }
        } catch (err) {
            status.rc = EthWalletVerificationCodes.RC_GENERAL_ERROR;
        }

        return status;
    }

}
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
