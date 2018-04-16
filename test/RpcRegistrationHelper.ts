import { RpcTransportImpl } from '../src/repository/source/rpc/RpcTransportImpl';
import { TransportFactory } from '../src/repository/source/TransportFactory';
import RpcAuth from '../src/utils/keypair/rpc/RpcAuth';
import RpcPassPhrase from '../src/utils/keypair/rpc/RpcPassPhrase';

export default class RpcRegistrationHelper {

    public static async generateAccessToken(host: string, passPhrase: string): Promise<string> {
        const rpcTransport: RpcTransportImpl = TransportFactory.createJsonRpcHttpTransport(host);
        const auth: RpcAuth = new RpcAuth();
        return rpcTransport.request('generateAccessToken', new RpcPassPhrase(passPhrase))
            .then((response: any) => auth = Object.assign(new RpcAuth(), response))
            .then((auth: RpcAuth) => rpcTransport.request('registerClient', auth))
            .then((response: any) => Promise.resolve(auth.accessToken));
    }

}
