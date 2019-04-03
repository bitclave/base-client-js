import { KeyPairHelper } from './KeyPairHelper';
import { RemoteSigner } from './RemoteSigner';

export interface RemoteKeyPairHelper extends KeyPairHelper, RemoteSigner {}
