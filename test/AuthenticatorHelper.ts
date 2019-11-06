import { RpcTransport } from '../src/repository/source/rpc/RpcTransport';
import { KeyPair } from '../src/utils/keypair/KeyPair';
import { KeyPairFactory } from '../src/utils/keypair/KeyPairFactory';
import { KeyPairHelper } from '../src/utils/keypair/KeyPairHelper';
import { RpcAuth } from '../src/utils/keypair/rpc/RpcAuth';
import { RpcAuthData, TokenType } from '../src/utils/keypair/rpc/RpcAuthData';
import { AssistantPermissions } from './requests/AssistantPermissions';
import DataRequestRepositoryImplMock from './requests/DataRequestRepositoryImplMock';

const dataRepository: DataRequestRepositoryImplMock = new DataRequestRepositoryImplMock();
const assistant: AssistantPermissions = new AssistantPermissions(dataRepository);

export default class AuthenticatorHelper {

    private static EXPIRE_TOKEN_HOURS_MS = 5 * 60 * 60 * 1000;

    private keyHelper: KeyPairHelper;
    private keyPair: KeyPair | undefined;
    private rpcTransport: RpcTransport;

    constructor(rpcTransport: RpcTransport) {
        this.rpcTransport = rpcTransport;
        this.keyHelper = KeyPairFactory.createDefaultKeyPair(assistant, assistant, '');
    }

    public async generateAccessToken(passPhrase: string): Promise<string> {
        if (this.keyPair === undefined) {
            await this.initKeyPair();
        }

        let accessToken: string = this.makeClearAccessToken();
        accessToken += await this.keyHelper.signMessage(accessToken);
        const signerPK: string = (await this.rpcTransport.request('getPublicKey')) as string;

        const expireDate = new Date(new Date().getTime() + AuthenticatorHelper.EXPIRE_TOKEN_HOURS_MS);
        const auth: RpcAuth = new RpcAuth(accessToken, passPhrase, 'http://localhost', expireDate);
        const encryptedAuth: string = await this.keyHelper.encryptMessage(signerPK, JSON.stringify(auth));
        const authData = new RpcAuthData(JSON.stringify(encryptedAuth), TokenType.BASIC);

        return await this.rpcTransport.request<string>('authenticatorRegisterClient', authData);
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
