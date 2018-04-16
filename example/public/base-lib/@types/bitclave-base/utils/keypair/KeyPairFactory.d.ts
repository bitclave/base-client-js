import { KeyPairHelper } from './KeyPairHelper';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
export declare class KeyPairFactory {
    static createDefaultKeyPair(): KeyPairHelper;
    static createRpcKeyPair(rpcTransport: RpcTransport): KeyPairHelper;
}
