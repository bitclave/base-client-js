import { KeyPairHelper } from './KeyPairHelper';
import KeyPair from './KeyPair';
export default class BitKeyPair implements KeyPairHelper {
    private privateKey;
    private publicKey;
    createKeyPair(passPhrase: string): KeyPair;
    signMessage(data: string): string;
    getPublicKey(): string;
    encryptMessage(recipientPk: string, message: string): string;
    generatePasswordForFiled(fieldName: String): string;
    decryptMessage(senderPk: string, encrypted: string): string;
}
