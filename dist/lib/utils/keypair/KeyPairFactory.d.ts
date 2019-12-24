import { PermissionsSource } from '../../repository/assistant/PermissionsSource';
import { SiteDataSource } from '../../repository/assistant/SiteDataSource';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { AccessTokenAccepter } from './AccessTokenAccepter';
import { KeyPairHelper } from './KeyPairHelper';
import { RemoteKeyPairHelper } from './RemoteKeyPairHelper';
export declare class KeyPairFactory {
    static createDefaultKeyPair(permissionsSource: PermissionsSource, siteDataSource: SiteDataSource, origin: string): KeyPairHelper;
    static createRpcKeyPair(rpcTransport: RpcTransport, tokenAccepter: AccessTokenAccepter): RemoteKeyPairHelper;
}
