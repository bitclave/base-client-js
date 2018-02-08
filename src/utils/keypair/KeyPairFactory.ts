import { KeyPairHelper } from './KeyPairHelper';
import BitKeyPair from './BitKeyPair';

export default class KeyPairFactory {

    public static getDefaultKeyPairCreator(): KeyPairHelper {
        return new BitKeyPair();
    }

}
