import BaseSchema from "./BaseSchema";
import * as BaseType from "../../src/utils/BaseTypes";

// import {KeyPairHelper} from "./keypair/KeyPairHelper";
// import KeyPairFactory from "./keypair/KeyPairFactory";
import {MessageSigner} from "./keypair/MessageSigner";
import BitKeyPair from "./keypair/BitKeyPair";

const Message = require('bitcore-message');
const bitcore = require('bitcore-lib');

const sigUtil = require('eth-sig-util');
const baseSchema = BaseSchema.getSchema();

export enum EthWalletVerificationCodes  {
    RC_OK = 0,
    RC_BASEID_MISSMATCH = -1,
    RC_ETH_ADDR_NOT_VERIFIED = -2,
    RC_ETH_ADDR_WRONG_SIGNATURE = -3,
    RC_ETH_ADDR_SCHEMA_MISSMATCH = -4,
    RC_GENERAL_ERROR = -100
}

export class EthWalletVerificationStatus
{
    public rc: EthWalletVerificationCodes = EthWalletVerificationCodes.RC_OK;
    public err: string = "";
    public details: Array<number> = [];
};

export default class BaseEthUtils {
    public static verifyEthAddrRecord(msg: BaseType.EthAddrRecord): EthWalletVerificationCodes {
        var signerAddr;
        try {
            if (!baseSchema.validateEthAddr(msg)) return EthWalletVerificationCodes.RC_ETH_ADDR_SCHEMA_MISSMATCH;
            if (!baseSchema.validateEthBaseAddrPair(JSON.parse(msg.data))) return EthWalletVerificationCodes.RC_ETH_ADDR_SCHEMA_MISSMATCH;
            if (msg.sig.length>0)
                signerAddr = sigUtil.recoverPersonalSignature(msg)
            else
                return EthWalletVerificationCodes.RC_ETH_ADDR_NOT_VERIFIED;
        }
        catch(err) {
            // console.log(err)
            return EthWalletVerificationCodes.RC_GENERAL_ERROR;
        }

        return (signerAddr==JSON.parse(msg.data).ethAddr)?
            EthWalletVerificationCodes.RC_OK :
            EthWalletVerificationCodes.RC_ETH_ADDR_WRONG_SIGNATURE;
    }

    public static createEthAddrRecord(baseID: string, ethAddr:string, ethPrvKey: string) : BaseType.EthAddrRecord
    {
        const msg = {
            data: JSON.stringify({
                baseID: baseID, ethAddr: ethAddr
            }),
            sig: ""
        };
        msg.sig = sigUtil.personalSign(Buffer.from(ethPrvKey, 'hex'), msg);
        return msg;
    }

    public static async dbg_createEthWalletsRecord(baseID: string, signedEthRecords : Array<any>, prvKey: string) : Promise<any>
    {
        // no verification is performed here
        var msgWallets =
            {
                data: signedEthRecords,
                sig: ""
            };
        const bitKeyPair = new BitKeyPair()
        bitKeyPair.initKeyPairFromPrvKey(prvKey);
        const messageSigner: MessageSigner = bitKeyPair;
        msgWallets.sig = await messageSigner.signMessage(JSON.stringify(msgWallets.data));
        return msgWallets;
    }

    public static async createEthWalletsRecord2(baseID: string, signedEthRecords : Array<any>, signer: MessageSigner) : Promise<any>
    {
        for (let msg of signedEthRecords)
        {
            if ((this.verifyEthAddrRecord(msg)!=EthWalletVerificationCodes.RC_OK) &&
                (this.verifyEthAddrRecord(msg)!=EthWalletVerificationCodes.RC_ETH_ADDR_NOT_VERIFIED)) throw "invalid eth record";
            if (baseID != JSON.parse(msg.data).baseID)  throw "baseID missmatch"
        }

        var msgWallets =
            {
                data: signedEthRecords,
                sig: ""
            };
        // console.log(msgWallets);
        if (!baseSchema.validateEthWallets(msgWallets)) throw "invalid wallets structure";

        // eth style signing
        // msgWallets.sig = sigUtil.personalSign(Buffer.from(prvKey, 'hex'), msgWallets);
        // var signerAddr = sigUtil.recoverPersonalSignature(msgWallets)
        // console.log(signerAddr);

        // BASE Style signing
        const messageSigner: MessageSigner = signer;
        msgWallets.sig = await messageSigner.signMessage(JSON.stringify(msgWallets.data))


        return msgWallets;

    }

    public static async createEthWalletsRecord(baseID: string, signedEthRecords : Array<any>, prvKey: string) : Promise<any>
    {
        for (let msg of signedEthRecords)
        {
            if (this.verifyEthAddrRecord(msg)!=EthWalletVerificationCodes.RC_OK) throw "invalid eth record";
            if (baseID != JSON.parse(msg.data).baseID)  throw "baseID missmatch"
        }

        var msgWallets =
        {
            data: signedEthRecords,
            sig: ""
        }
            // console.log(msgWallets);
        if (!baseSchema.validateEthWallets(msgWallets)) throw "invalid wallets structure";

        // eth style signing
        // msgWallets.sig = sigUtil.personalSign(Buffer.from(prvKey, 'hex'), msgWallets);
        // var signerAddr = sigUtil.recoverPersonalSignature(msgWallets)
        // console.log(signerAddr);

        // BASE Style signing
        const bitKeyPair = new BitKeyPair()
        bitKeyPair.initKeyPairFromPrvKey(prvKey);
        const messageSigner: MessageSigner = bitKeyPair;
        msgWallets.sig = await messageSigner.signMessage(JSON.stringify(msgWallets.data))

        const basePubKey = bitKeyPair.getPublicKey();
        const baseAddr = bitKeyPair.getAddr();

        if (basePubKey!=baseID) throw "baseID and basePubKey missmatch";
        if (!Message(JSON.stringify(msgWallets.data)).verify(baseAddr, msgWallets.sig)) throw "BASE signature missmath";
        return msgWallets;
    }


    public static verifyEthWalletsRecord(baseID: string, msg: any): EthWalletVerificationStatus
    {
        var rc: EthWalletVerificationCodes;
        const res: EthWalletVerificationStatus = new EthWalletVerificationStatus();
        res.rc = EthWalletVerificationCodes.RC_OK;

        if (!baseSchema.validateEthWallets(msg))
        {
            res.rc = EthWalletVerificationCodes.RC_ETH_ADDR_SCHEMA_MISSMATCH;
            return res;
        }

        const basePubKey = baseID;

        // verify all baseID keys are the same in ETH records
        for (let e of msg.data)
        {
            const pubKey = JSON.parse(e.data).baseID;
            if (pubKey!=basePubKey)
            {
                res.details.push(EthWalletVerificationCodes.RC_BASEID_MISSMATCH);
            }
            else if ((rc=this.verifyEthAddrRecord(e))!=EthWalletVerificationCodes.RC_OK)
            {
                res.details.push(rc)
            }
            else
                res.details.push(EthWalletVerificationCodes.RC_OK);
        }

        // verify signature matches the baseID
        const baseAddr = new bitcore.PublicKey.fromString(basePubKey).toAddress().toString(16);
        var sigCheck = false;

        try {
            if (msg.sig.length > 0) {
                sigCheck = Message(JSON.stringify(msg.data)).verify(baseAddr, msg.sig);
                if (!sigCheck)
                    res.rc = EthWalletVerificationCodes.RC_ETH_ADDR_WRONG_SIGNATURE;
            }
            else
                res.rc = EthWalletVerificationCodes.RC_ETH_ADDR_NOT_VERIFIED;
        }
        catch(err)
        {
            res.rc = EthWalletVerificationCodes.RC_GENERAL_ERROR;
        }

        return res;
    }
}
