import * as CryptoJS from 'crypto-js';

export default class CryptoUtil {

    public static keccak256(message: string): string {
        const array: Object = CryptoJS.SHA3(message, {outputLength: 256});

        return array.toString(CryptoJS.enc.Hex);
    }

    public static encryptAes256(message: string, pass: string): string {
        const array = CryptoJS.AES.encrypt(message, pass, {outputLength: 256});

        return array.toString(CryptoJS.enc.Hex);
    }

    public static decryptAes256(encrypted: string, pass: string): string {
        const array = CryptoJS.AES.decrypt(message, pass, {outputLength: 256});

        return array.toString(CryptoJS.enc.Hex);
    }

}