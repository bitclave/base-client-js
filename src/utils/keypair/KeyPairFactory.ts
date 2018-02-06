import { KeyPairCreator } from './KeyPairCreator';
import BitKeyPair from './BitKeyPair';

export default class KeyPairFactory {

    public static getDefaultKeyPairCreator(): KeyPairCreator {
        return new BitKeyPair();
    }

}
