import { KeyPairHelper } from './KeyPairHelper';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { Permissions } from './Permissions';
export declare class KeyPairFactory {
    static createDefaultKeyPair(permissions: Permissions): KeyPairHelper;
    static createRpcKeyPair(rpcTransport: RpcTransport): KeyPairHelper;
}
