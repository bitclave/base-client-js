import { MessageData } from 'eth-sig-util';
import { EthereumUtils } from '../../src/utils/EthereumUtils';
import { BaseSchema } from '../../src/utils/types/BaseSchema';
import { AddrRecord, BaseAddrPair, WalletsRecords } from '../../src/utils/types/BaseTypes';
import { WalletUtils, WalletVerificationCodes } from '../../src/utils/WalletUtils';

const Message = require('bitcore-message');
const Bitcore = require('bitcore-lib');

const sigUtil = require('eth-sig-util');
const baseSchema = new BaseSchema();

export default class BaseEthUtils {

    public static verifyAddressRecord(record: AddrRecord): EthWalletVerificationCodes {
        let signerAddr: string;
        try {
            if (!baseSchema.validateAddr(record)) {
                return EthWalletVerificationCodes.RC_ETH_ADDR_SCHEMA_MISSMATCH;
            }

            if (!baseSchema.validateBaseAddrPair(record.data)) {
                return EthWalletVerificationCodes.RC_ETH_ADDR_SCHEMA_MISSMATCH;
            }

            if (record.sig.length > 0) {
                signerAddr = EthereumUtils.recoverPersonalSignature(record);
            } else {
                return EthWalletVerificationCodes.RC_ETH_ADDR_NOT_VERIFIED;
            }

        } catch (err) {
            return EthWalletVerificationCodes.RC_GENERAL_ERROR;
        }

        return (signerAddr === record.data.ethAddr)
               ? EthWalletVerificationCodes.RC_OK
               : EthWalletVerificationCodes.RC_ETH_ADDR_WRONG_SIGNATURE;
    }

    public static createEthAddrRecord(baseID: string, ethAddr: string, ethPrvKey: string): AddrRecord {
        const record: AddrRecord = new AddrRecord(
            JSON.stringify(new BaseAddrPair(baseID, ethAddr)),
            ''
        );
        const sig: string = sigUtil.personalSign(Buffer.from(ethPrvKey, 'hex'), record.getMessage());

        return new AddrRecord(record.data, sig);
    }

    public static async createEthWalletsRecordDebug(
        baseID: string,
        signedEthRecords: Array<AddrRecord>,
        prvKey: string
    ): Promise<WalletsRecords> {
        // no verification is performed here
        const msgWallets: WalletsRecords = new WalletsRecords(signedEthRecords, '');

        const privateKey = new Bitcore.PrivateKey(Bitcore.crypto.BN.fromString(prvKey, 16));
        const data: Array<MessageData> = msgWallets.data.map((item) => item.getMessage());

        const message = new Message(JSON.stringify(data));

        return new WalletsRecords(msgWallets.data, message.sign(privateKey));
    }

    public static async createEthWalletsRecordWithSigner(
        baseID: string,
        signedRecords: Array<AddrRecord>,
        privKey: string
    ): Promise<WalletsRecords> {
        for (const record of signedRecords) {
            if ((WalletUtils.verifyAddressRecord(record) !== WalletVerificationCodes.RC_OK) &&
                (WalletUtils.verifyAddressRecord(record) !== WalletVerificationCodes.RC_ADDR_NOT_VERIFIED)) {
                throw new Error(`invalid eth record: ${record}`);
            }

            if (baseID !== record.data.baseID) {
                throw new Error('baseID missmatch');
            }
        }

        const walletsRecords: WalletsRecords = new WalletsRecords(signedRecords, '');

        if (!baseSchema.validateWallets(walletsRecords)) {
            throw new Error('invalid wallets structure');
        }

        // eth style signing
        // msgWallets.sig = sigUtil.personalSign(Buffer.from(prvKey, 'hex'), msgWallets);
        // const signerAddr = sigUtil.recoverPersonalSignature(msgWallets)

        // BASE Style signing
        const privateKey = new Bitcore.PrivateKey(Bitcore.crypto.BN.fromString(privKey, 16));
        const data: Array<MessageData> = walletsRecords.data.map((item) => item.getMessage());

        const message = new Message(JSON.stringify(data));
        const sig: string = message.sign(privateKey);

        return new WalletsRecords(walletsRecords.data, sig);
    }

    public static verifyWalletsRecord(baseID: string, walletsRecords: WalletsRecords): EthWalletVerificationStatus {
        const status: EthWalletVerificationStatus = new EthWalletVerificationStatus();
        status.rc = EthWalletVerificationCodes.RC_OK;

        if (!baseSchema.validateWallets(walletsRecords)) {
            status.rc = EthWalletVerificationCodes.RC_ETH_ADDR_SCHEMA_MISSMATCH;
            return status;
        }

        const basePubKey = baseID;

        // verify all baseID keys are the same in ETH records
        for (const item of walletsRecords.data) {
            const pubKey = item.data.baseID;
            if (pubKey !== basePubKey) {
                status.details.push(EthWalletVerificationCodes.RC_BASEID_MISSMATCH);

            } else if (BaseEthUtils.verifyAddressRecord(item) !== EthWalletVerificationCodes.RC_OK) {
                const resultCode = BaseEthUtils.verifyAddressRecord(item);
                status.details.push(resultCode);

            } else {
                status.details.push(EthWalletVerificationCodes.RC_OK);
            }
        }

        // verify signature matches the baseID
        const baseAddr = new Bitcore.PublicKey.fromString(basePubKey).toAddress().toString(16);
        let sigCheck = false;

        try {
            if (walletsRecords.sig.length > 0) {
                sigCheck = Message(JSON.stringify(walletsRecords.data)).verify(baseAddr, walletsRecords.sig);
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

export enum EthWalletVerificationCodes {
    RC_OK = 0,
    RC_BASEID_MISSMATCH = -1,
    RC_ETH_ADDR_NOT_VERIFIED = -2,
    RC_ETH_ADDR_WRONG_SIGNATURE = -3,
    RC_ETH_ADDR_SCHEMA_MISSMATCH = -4,
    RC_GENERAL_ERROR = -100,
}

export class EthWalletVerificationStatus {
    public rc: EthWalletVerificationCodes;
    public err: string;
    public details: Array<number>;
}
