const Bitcore = require('bitcore-lib');
const Message = require('bitcore-message');
const Signature = Bitcore.crypto.Signature;
const ECDSA = Bitcore.crypto.ECDSA;

export class BitcoinUtils {

    public static isValidPublicKey(publicKey: string): boolean {
        return Bitcore.PublicKey.isValid(publicKey);
    }

    public static isValidAddress(address: string): boolean {
        return Bitcore.Address.isValid(address);
    }

    public static isValidSignature(publicKey: string, msg: string, sig: string): boolean {
        const hash = Message(msg).magicHash();

        return ECDSA.verify(hash, sig, publicKey);
    }

    public static getPublicKeyBySignature(msg: string, sig: string): string {
        const ecdsa = new ECDSA();

        ecdsa.hashbuf = Message(msg).magicHash();
        ecdsa.sig = Signature.fromCompact(Buffer.from(sig, 'base64'));

        return ecdsa.toPublicKey();
    }
}
