import { RpcTransport } from '../src/repository/source/rpc/RpcTransport';
import { KeyPair } from '../src/utils/keypair/KeyPair';
import { KeyPairFactory } from '../src/utils/keypair/KeyPairFactory';
import { KeyPairHelper } from '../src/utils/keypair/KeyPairHelper';
import { RpcAccessToken } from '../src/utils/keypair/rpc/RpcAccessToken';
import { AssistantPermissions } from './requests/AssistantPermissions';
import DataRequestRepositoryImplMock from './requests/DataRequestRepositoryImplMock';

const dataRepository: DataRequestRepositoryImplMock = new DataRequestRepositoryImplMock();
const assistant: AssistantPermissions = new AssistantPermissions(dataRepository);

export default class AuthenticatorHelper {

    public static EXPIRE_TOKEN_HOURS_MS = 5 * 60 * 60 * 1000;

    private keyHelper: KeyPairHelper;
    private keyPair: KeyPair | undefined;
    private rpcTransport: RpcTransport;

    constructor(rpcTransport: RpcTransport) {
        this.rpcTransport = rpcTransport;
        this.keyHelper = KeyPairFactory.createDefaultKeyPair(assistant, assistant, '');
    }

    public async generateAccessToken(
        passPhrase: string,
        expireTimeMs: number = AuthenticatorHelper.EXPIRE_TOKEN_HOURS_MS
    ): Promise<string> {
        if (this.keyPair === undefined) {
            await this.initKeyPair();
        }

        const signerPK: string = (await this.rpcTransport.request('getPublicKey')) as string;

        const expireDate = new Date(new Date().getTime() + expireTimeMs);
        const auth: RpcAccessToken = new RpcAccessToken(passPhrase, ['*'], expireDate);

        return await this.keyHelper.encryptMessage(signerPK, JSON.stringify(auth));
    }

    private async initKeyPair() {
        this.keyPair = await this.keyHelper.createKeyPair('TestAuthenticatorService');
    }
}
