export declare class CryptoUtils {
    static keccak256(message: string): string;
    static sha384(message: string): string;
    static encryptAes256(message: string, pass: string): string;
    static decryptAes256(ciphertext: string, pass: string): string;
    static PBKDF2(password: string, keySize: number): string;
}
