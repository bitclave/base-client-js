import { KeyPairHelper } from './KeyPairHelper';
import BitKeyPair from './BitKeyPair';
import RpcKeyPair from './rpc/RpcKeyPair';

export default class KeyPairFactory {

    public static getDefaultKeyPairCreator(): KeyPairHelper {
        return new BitKeyPair();
    }

    public static getRpcKeyPairCreator(client: any): KeyPairHelper {
        return new RpcKeyPair(client);
    }

}
