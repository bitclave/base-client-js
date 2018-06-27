const CryptoJS = require('crypto-js');

export class CryptoUtils {

    public static keccak256(message: string): string {
        const array: any = CryptoJS.SHA3(message, {outputLength: 256});

        return array.toString(CryptoJS.enc.Hex);
    }

    public static sha384(message: string): string {
        const array: any = CryptoJS.SHA384(message);

        return array.toString(CryptoJS.enc.Hex);
    }

    public static encryptAes256(message: string, pass: string): string {
        const ciphertext: any = CryptoJS.AES.encrypt(message, pass, {outputLength: 256});

        return ciphertext.toString();
    }

    public static decryptAes256(ciphertext: string, pass: string): string {
        const bytes = CryptoJS.AES.decrypt(ciphertext, pass, {outputLength: 256});

        return bytes.toString(CryptoJS.enc.Utf8);
    }

    public static PBKDF2(password: string, keySize: number): string { //for generate private key
        return CryptoJS.PBKDF2(
            password,
            CryptoUtils.sha384(CryptoUtils.sha384(password)),
            {keySize: keySize / 32, iterations: 100}
        ).toString(CryptoJS.enc.Hex);
    }

}
