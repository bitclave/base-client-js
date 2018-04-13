import { KeyPair } from './KeyPair';
import { MessageSigner } from './MessageSigner';
import { MessageEncrypt } from './MessageEncrypt';
import { MessageDecrypt } from './MessageDecrypt';

export interface KeyPairHelper extends MessageSigner, MessageEncrypt, MessageDecrypt {

    createKeyPair(passPhrase: string): Promise<KeyPair>

    generateMnemonicPhrase(): Promise<string>

}
