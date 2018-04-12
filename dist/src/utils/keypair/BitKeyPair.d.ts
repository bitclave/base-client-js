import { KeyPairHelper } from './KeyPairHelper';
import KeyPair from './KeyPair';
export default class BitKeyPair implements KeyPairHelper {
    private privateKey;
    private publicKey;
    private addr;
    createKeyPair(passPhrase: string): Promise<KeyPair>;
    generateMnemonicPhrase(): Promise<string>;
    initKeyPairFromPrvKey(prvKey: string): KeyPair;
    signMessage(data: string): Promise<string>;
    checkSig(data: string, sig: string): Promise<boolean>;
    getPublicKey(): string;
    getAddr(): string;
    encryptMessage(recipientPk: string, message: string): Promise<string>;
    generatePasswordForField(fieldName: String): Promise<string>;
    decryptMessage(senderPk: string, encrypted: string): Promise<string>;
}
