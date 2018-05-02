import { KeyPairHelper } from './KeyPairHelper';
import { BitKeyPair } from './BitKeyPair';
import { RpcKeyPair } from './rpc/RpcKeyPair';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { PermissionsSource } from '../../repository/assistant/PermissionsSource';
import { SiteDataSource } from '../../repository/assistant/SiteDataSource';

export class KeyPairFactory {

    public static createDefaultKeyPair(permissionsSource: PermissionsSource,
                                       siteDataSource: SiteDataSource,
                                       origin: string): KeyPairHelper {
        return new BitKeyPair(permissionsSource, siteDataSource, origin);
    }

    public static createRpcKeyPair(rpcTransport: RpcTransport): KeyPairHelper {
        return new RpcKeyPair(rpcTransport);
    }

}
