import { KeyPairHelper } from './KeyPairHelper';
import { BitKeyPair } from './BitKeyPair';
import { RpcKeyPair } from './rpc/RpcKeyPair';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';

export class KeyPairFactory {

    public static createDefaultKeyPair(): KeyPairHelper {
        return new BitKeyPair();
    }

    public static createRpcKeyPair(rpcTransport: RpcTransport): KeyPairHelper {
        return new RpcKeyPair(rpcTransport);
    }

}
