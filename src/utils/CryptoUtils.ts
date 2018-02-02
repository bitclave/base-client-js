const CryptoJS = require('crypto-js');

export default class CryptoUtils {

    public static keccak256(message: string): string {
        const array: any = CryptoJS.SHA3(message, {outputLength: 256});

        return array.toString(CryptoJS.enc.Hex);
    }

    public static encryptAes256(message: string, pass: string): string {
        const array: any = CryptoJS.AES.encrypt(message, pass, {outputLength: 256});

        return array.toString(CryptoJS.enc.Utf8);
    }

    public static decryptAes256(encrypted: string, pass: string): string {
        const array = CryptoJS.AES.decrypt(encrypted, pass, {outputLength: 256});

        return array.toString(CryptoJS.enc.Hex);
    }

}
