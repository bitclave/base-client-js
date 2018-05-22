import { AddrRecord, BaseAddrPair, WalletsRecords } from '../../src/utils/types/BaseTypes';
import { BaseSchema } from '../../src/utils/types/BaseSchema';
import { WalletUtils, WalletVerificationCodes, WalletVerificationStatus } from '../../src/utils/WalletUtils';

const Message = require('bitcore-message');
const bitcore = require('bitcore-lib');

const sigUtil = require('eth-sig-util');
const baseSchema = new BaseSchema();

export default class BaseEthUtils {

    public static createEthAddrRecord(baseID: string, addr: string, ethPrvKey: string): AddrRecord {
        const record: AddrRecord = new AddrRecord(
            JSON.stringify(new BaseAddrPair(baseID, addr)),
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
            if ((WalletUtils.verifyEthAddressRecord(record) != WalletVerificationCodes.RC_OK) &&
                (WalletUtils.verifyEthAddressRecord(record) != WalletVerificationCodes.RC_ADDR_NOT_VERIFIED)) {
                throw 'invalid eth record: ' + record;
            }

            if (baseID != JSON.parse(record.data).baseID) {
                throw 'baseID missmatch';
            }
        }

        const ethWalletsRecords: WalletsRecords = new WalletsRecords(signedRecords, '');

        if (!baseSchema.validateEthWallets(ethWalletsRecords)) {
            throw 'invalid wallets structure';
        }

        // eth style signing
        // msgWallets.sig = sigUtil.personalSign(Buffer.from(prvKey, 'hex'), msgWallets);
        // var signerAddr = sigUtil.recoverPersonalSignature(msgWallets)

        // BASE Style signing
        const privateKey = new bitcore.PrivateKey(bitcore.crypto.BN.fromString(privKey, 16));
        const message = new Message(JSON.stringify(ethWalletsRecords.data));

        ethWalletsRecords.sig = message.sign(privateKey);

        return ethWalletsRecords;
    }

    public static verifyEthWalletsRecord(baseID: string, msg: any): WalletVerificationStatus {
        let resultCode: WalletVerificationCodes;
        const status: WalletVerificationStatus = new WalletVerificationStatus();
        status.rc = WalletVerificationCodes.RC_OK;

        if (!baseSchema.validateEthWallets(msg)) {
            status.rc = WalletVerificationCodes.RC_ADDR_SCHEMA_MISSMATCH;
            return status;
        }

        const basePubKey = baseID;

        // verify all baseID keys are the same in ETH records
        for (let item of msg.data) {
            const pubKey = JSON.parse(item.data).baseID;
            if (pubKey != basePubKey) {
                status.details.push(WalletVerificationCodes.RC_BASEID_MISSMATCH);

            } else if ((resultCode = WalletUtils.verifyEthAddressRecord(item)) != WalletVerificationCodes.RC_OK) {
                status.details.push(resultCode);

            } else {
                status.details.push(WalletVerificationCodes.RC_OK);
            }
        }

        // verify signature matches the baseID
        const baseAddr = new bitcore.PublicKey.fromString(basePubKey).toAddress().toString();
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

}
