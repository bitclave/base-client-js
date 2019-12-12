const Bitcore = require('bitcore-lib');
const Message = require('bitcore-message');
const Signature = Bitcore.crypto ? Bitcore.crypto.Signature : null;
const ECDSA = Bitcore.crypto ? Bitcore.crypto.ECDSA : null;

export class BitcoinUtils {

    public static isValidPublicKey(publicKey: string): boolean {
        return Bitcore.PublicKey.isValid(publicKey);
    }

    public static isValidAddress(address: string): boolean {
        return Bitcore.Address.isValid(address);
    }

    public static isValidSignature(publicKey: string, msg: string, sig: string): boolean {
        try {
            const hash = Message(msg).magicHash();
            const ecdsa = new ECDSA();

            ecdsa.hashbuf = hash;
            ecdsa.sig = Signature.fromCompact(Buffer.from(sig, 'base64'));

            const pk = ecdsa.toPublicKey();

            return publicKey === pk.toString() && ECDSA.verify(hash, ecdsa.sig, pk);

        } catch (e) {
            return false;
        }
    }

    public static signedMessageToPublicKey(msg: string, sig: string): string {
        const ecdsa = new ECDSA();

        ecdsa.hashbuf = Message(msg).magicHash();
        ecdsa.sig = Signature.fromCompact(Buffer.from(sig, 'base64'));

        return ecdsa.toPublicKey().toString();
    }
}
