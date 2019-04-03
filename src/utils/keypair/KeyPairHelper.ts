import { KeyPair } from './KeyPair';
import { MessageDecrypt } from './MessageDecrypt';
import { MessageEncrypt } from './MessageEncrypt';
import { MessageSigner } from './MessageSigner';

export interface KeyPairHelper extends MessageSigner, MessageEncrypt, MessageDecrypt {

    createKeyPair(passPhrase: string): Promise<KeyPair>;

    generateMnemonicPhrase(): Promise<string>;

}
