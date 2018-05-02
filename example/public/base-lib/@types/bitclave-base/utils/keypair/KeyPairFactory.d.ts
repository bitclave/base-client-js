import { KeyPairHelper } from './KeyPairHelper';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { PermissionsSource } from '../../repository/assistant/PermissionsSource';
import { SiteDataSource } from '../../repository/assistant/SiteDataSource';
export declare class KeyPairFactory {
    static createDefaultKeyPair(permissionsSource: PermissionsSource, siteDataSource: SiteDataSource, origin: string): KeyPairHelper;
    static createRpcKeyPair(rpcTransport: RpcTransport): KeyPairHelper;
}
