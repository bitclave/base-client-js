import { KeyPairHelper } from './KeyPairHelper';
import KeyPair from './KeyPair';
export default class BitKeyPair implements KeyPairHelper {
    private privateKey;
    private publicKey;
    private addr;
    createKeyPair(passPhrase: string): KeyPair;
    initKeyPairFromPrvKey(prvKey: string): KeyPair;
    signMessage(data: string): string;
    getPublicKey(): string;
    getAddr(): string;
    encryptMessage(recipientPk: string, message: string): string;
    generatePasswordForField(fieldName: String): string;
    decryptMessage(senderPk: string, encrypted: string): string;
}
