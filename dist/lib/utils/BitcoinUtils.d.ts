export declare class BitcoinUtils {
    static isValidPublicKey(publicKey: string): boolean;
    static isValidAddress(address: string): boolean;
    static isValidSignature(publicKey: string, msg: string, sig: string): boolean;
    static signedMessageToPublicKey(msg: string, sig: string): string;
}
