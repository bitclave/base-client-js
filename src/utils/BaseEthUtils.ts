import BaseSchema from './BaseSchema';
import * as BaseType from '../../src/utils/BaseTypes';
import { MessageSigner } from './keypair/MessageSigner';
import BitKeyPair from './keypair/BitKeyPair';

const Message = require('bitcore-message');
const bitcore = require('bitcore-lib');

const sigUtil = require('eth-sig-util');
const baseSchema = BaseSchema.getInstance();

export enum EthWalletVerificationCodes {
    RC_OK = 0,
    RC_BASEID_MISSMATCH = -1,
    RC_ETH_ADDR_NOT_VERIFIED = -2,
    RC_ETH_ADDR_WRONG_SIGNATURE = -3,
    RC_ETH_ADDR_SCHEMA_MISSMATCH = -4,
    RC_GENERAL_ERROR = -100
}

export class EthWalletVerificationStatus {
    public rc: EthWalletVerificationCodes = EthWalletVerificationCodes.RC_OK;
    public err: string = '';
    public details: Array<number> = [];
}

export default class BaseEthUtils {

    public static verifyEthAddrRecord(msg: BaseType.EthAddrRecord): EthWalletVerificationCodes {
        let signerAddr;
        try {
            if (!baseSchema.validateEthAddr(msg)) {
                return EthWalletVerificationCodes.RC_ETH_ADDR_SCHEMA_MISSMATCH;
            }

            if (!baseSchema.validateEthBaseAddrPair(JSON.parse(msg.data))) {
                return EthWalletVerificationCodes.RC_ETH_ADDR_SCHEMA_MISSMATCH;
            }

            if (msg.sig.length > 0) {
                signerAddr = sigUtil.recoverPersonalSignature(msg);
            } else {
                return EthWalletVerificationCodes.RC_ETH_ADDR_NOT_VERIFIED;
            }

        } catch (err) {
            return EthWalletVerificationCodes.RC_GENERAL_ERROR;
        }

        return (signerAddr == JSON.parse(msg.data).ethAddr)
            ? EthWalletVerificationCodes.RC_OK
            : EthWalletVerificationCodes.RC_ETH_ADDR_WRONG_SIGNATURE;
    }

    public static createEthAddrRecord(baseID: string, ethAddr: string, ethPrvKey: string): BaseType.EthAddrRecord {
        const record: BaseType.EthAddrRecord = new BaseType.EthAddrRecord(
            JSON.stringify(new BaseType.EthBaseAddrPair(baseID, ethAddr)),
            ''
        );
        record.sig = sigUtil.personalSign(Buffer.from(ethPrvKey, 'hex'), record);

        return record;
    }

    public static async createEthWalletsRecordDebug(baseID: string, signedEthRecords: Array<BaseType.EthAddrRecord>,
                                                    prvKey: string): Promise<BaseType.EthWallets> {
        // no verification is performed here
        const msgWallets: BaseType.EthWallets = new BaseType.EthWallets(signedEthRecords, '');

        const bitKeyPair = new BitKeyPair();
        bitKeyPair.initKeyPairFromPrvKey(prvKey);

        msgWallets.sig = await bitKeyPair.signMessage(JSON.stringify(msgWallets.data));

        return msgWallets;
    }

    public static async createEthWalletsRecordWithSigner(baseID: string, signedEthRecords: Array<BaseType.EthAddrRecord>,
                                                         signer: MessageSigner): Promise<BaseType.EthWallets> {
        for (let msg of signedEthRecords) {
            if ((this.verifyEthAddrRecord(msg) != EthWalletVerificationCodes.RC_OK) &&
                (this.verifyEthAddrRecord(msg) != EthWalletVerificationCodes.RC_ETH_ADDR_NOT_VERIFIED)) {
                throw 'invalid eth record';
            }

            if (baseID != JSON.parse(msg.data).baseID) {
                throw 'baseID missmatch';
            }
        }

        const msgWallets: BaseType.EthWallets = new BaseType.EthWallets(signedEthRecords, '');

        if (!baseSchema.validateEthWallets(msgWallets)) {
            throw 'invalid wallets structure';
        }

        // eth style signing
        // msgWallets.sig = sigUtil.personalSign(Buffer.from(prvKey, 'hex'), msgWallets);
        // var signerAddr = sigUtil.recoverPersonalSignature(msgWallets)

        // BASE Style signing
        msgWallets.sig = await signer.signMessage(JSON.stringify(msgWallets.data));

        return msgWallets;
    }

    public static async createEthWalletsRecordWithPrvKey(baseID: string,
                                                         signedEthRecords: Array<BaseType.EthAddrRecord>,
                                                         prvKey: string): Promise<BaseType.EthWallets> {
        const bitKeyPair = new BitKeyPair();
        bitKeyPair.initKeyPairFromPrvKey(prvKey);

        return this.createEthWalletsRecordWithSigner(baseID, signedEthRecords, bitKeyPair);
    }

    public static verifyEthWalletsRecord(baseID: string, msg: any): EthWalletVerificationStatus {
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
            if (pubKey != basePubKey) {
                status.details.push(EthWalletVerificationCodes.RC_BASEID_MISSMATCH);

            } else if ((resultCode = this.verifyEthAddrRecord(item)) != EthWalletVerificationCodes.RC_OK) {
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
                if (!sigCheck)
                    status.rc = EthWalletVerificationCodes.RC_ETH_ADDR_WRONG_SIGNATURE;
            } else {
                status.rc = EthWalletVerificationCodes.RC_ETH_ADDR_NOT_VERIFIED;
            }
        } catch (err) {
            status.rc = EthWalletVerificationCodes.RC_GENERAL_ERROR;
        }

        return status;
    }

}
