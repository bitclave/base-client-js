import { KeyPairCreator } from './KeyPairCreator';
import KeyPair from './KeyPair';
export default class BitKeyPair implements KeyPairCreator {
    createKeyPair(passPhrase: string): KeyPair;
}
