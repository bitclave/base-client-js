import { PermissionsSource } from '../../repository/assistant/PermissionsSource';
import { SiteDataSource } from '../../repository/assistant/SiteDataSource';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { AccessTokenAccepter } from './AccessTokenAccepter';
import { BitKeyPair } from './BitKeyPair';
import { KeyPairHelper } from './KeyPairHelper';
import { RemoteKeyPairHelper } from './RemoteKeyPairHelper';
import { RpcKeyPair } from './rpc/RpcKeyPair';

export class KeyPairFactory {

    public static createDefaultKeyPair(
        permissionsSource: PermissionsSource,
        siteDataSource: SiteDataSource,
        origin: string
    ): KeyPairHelper {
        return new BitKeyPair(permissionsSource, siteDataSource, origin);
    }

    public static createRpcKeyPair(
        rpcTransport: RpcTransport,
        tokenAccepter: AccessTokenAccepter
    ): RemoteKeyPairHelper {
        return new RpcKeyPair(rpcTransport, tokenAccepter);
    }
}
