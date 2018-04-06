import { KeyPairHelper } from './KeyPairHelper';
import KeyPair from './KeyPair';
export default class BitKeyPair implements KeyPairHelper {
    private privateKey;
    private publicKey;
    private addr;
    createKeyPair(passPhrase: string): KeyPair;
    generateMnemonicPhrase(): string;
    initKeyPairFromPrvKey(prvKey: string): KeyPair;
    signMessage(data: string): string;
    checkSig(data: any, sig: string): boolean;
    getPublicKey(): string;
    getAddr(): string;
    encryptMessage(recipientPk: string, message: string): string;
    generatePasswordForField(fieldName: String): string;
    decryptMessage(senderPk: string, encrypted: string): string;
}
