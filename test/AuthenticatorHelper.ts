import { KeyPair } from '../src/utils/keypair/KeyPair';
import { KeyPairFactory } from '../src/utils/keypair/KeyPairFactory';
import { RpcTransport } from '../src/repository/source/rpc/RpcTransport';
import { KeyPairHelper } from '../src/utils/keypair/KeyPairHelper';
import { Permissions } from '../src/utils/keypair/Permissions';
import { RpcAuth } from '../src/utils/keypair/rpc/RpcAuth';

export default class AuthenticatorHelper {

    private keyHelper: KeyPairHelper;
    private keyPair: KeyPair = null;
    private rpcTransport: RpcTransport;

    constructor(rpcTransport: RpcTransport) {
        this.rpcTransport = rpcTransport;
        this.keyHelper = KeyPairFactory.createDefaultKeyPair(null, null, '');
    }

    public async generateAccessToken(passPhrase: string): Promise<string> {
        if (this.keyPair == null) {
            await this.initKeyPair();
        }

        let accessToken: string = this.makeClearAccessToken();
        accessToken += await this.keyHelper.signMessage(accessToken);
        const signerPK: string = await this.rpcTransport.request('getPublicKey', null);

        const auth: RpcAuth = new RpcAuth(accessToken, passPhrase, 'http://localhost', '');
        const encryptedAuth: string = await this.keyHelper.encryptMessage(signerPK, JSON.stringify(auth));
        await this.rpcTransport.request('authenticatorRegisterClient', encryptedAuth);

        return accessToken;
    }

    private async initKeyPair() {
        this.keyPair = await this.keyHelper.createKeyPair('TestAuthenticatorService');
    }

    private makeClearAccessToken(): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

}
