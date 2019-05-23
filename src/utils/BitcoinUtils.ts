const Bitcore = require('bitcore-lib');
const Message = require('bitcore-message');

export class BitcoinUtils {

    public static isValidPublicKey(publicKey: string): boolean {
        return Bitcore.PublicKey.isValid(publicKey);
    }

    public static isValidAddress(address: string): boolean {
        return Bitcore.Address.isValid(address);
    }

    public static isValidSignature(address: string, msg: string, sig: string): boolean {
        return Message(msg).verify(address, sig);
    }
}
