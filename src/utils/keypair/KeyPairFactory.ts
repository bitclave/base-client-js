import { KeyPairHelper } from './KeyPairHelper';
import { BitKeyPair } from './BitKeyPair';
import { RpcKeyPair } from './rpc/RpcKeyPair';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { Permissions } from './Permissions';

export class KeyPairFactory {

    public static createDefaultKeyPair(permissions: Permissions): KeyPairHelper {
        return new BitKeyPair(permissions);
    }

    public static createRpcKeyPair(rpcTransport: RpcTransport): KeyPairHelper {
        return new RpcKeyPair(rpcTransport);
    }

}
