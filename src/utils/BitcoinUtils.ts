const Bitcore = require('bitcore-lib');

export class BitcoinUtils {

    public static isValidPublicKey(publicKey: string): boolean {
        return Bitcore.PublicKey.isValid(publicKey);
    }

    public static isValidAddress(address: string): boolean {
        return Bitcore.Address.isValid(address);
    }
}
