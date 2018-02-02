export default class CryptoUtils {
    static keccak256(message: string): string;
    static encryptAes256(message: string, pass: string): string;
    static decryptAes256(encrypted: string, pass: string): string;
}
