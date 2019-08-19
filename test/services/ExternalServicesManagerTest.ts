// tslint:disable:no-unused-expression
import Base, { ExternalService, HttpServiceCall, KeyPairFactory, KeyPairHelper, ServiceCallType } from '../../src/Base';
import Account from '../../src/repository/models/Account';
import { RepositoryStrategyType } from '../../src/repository/RepositoryStrategyType';
import { HttpMethod } from '../../src/repository/source/http/HttpMethod';
import SignedRequest from '../../src/repository/source/http/SignedRequest';
import { TransportFactory } from '../../src/repository/source/TransportFactory';
import AuthenticatorHelper from '../AuthenticatorHelper';
import { AssistantPermissions } from '../requests/AssistantPermissions';
import DataRequestRepositoryImplMock from '../requests/DataRequestRepositoryImplMock';

require('chai').use(require('chai-as-promised')).should();
const someSigMessage = 'some unique message for signature';

const baseNodeUrl = process.env.BASE_NODE_URL || 'https://base2-bitclva-com.herokuapp.com';
const rpcSignerHost = process.env.SIGNER || 'http://localhost:3545';

const rpcTransport = TransportFactory.createJsonRpcHttpTransport(rpcSignerHost);
const authenticatorHelper: AuthenticatorHelper = new AuthenticatorHelper(rpcTransport);
const dataRepository: DataRequestRepositoryImplMock = new DataRequestRepositoryImplMock();

const assistant: AssistantPermissions = new AssistantPermissions(dataRepository);
const keyPairHelper: KeyPairHelper = KeyPairFactory.createDefaultKeyPair(assistant, assistant, '');

async function createUser(user: Base, pass: string): Promise<Account> {
    let accessToken: string = '';
    try {
        accessToken = await authenticatorHelper.generateAccessToken(pass);
        await user.accountManager.authenticationByAccessToken(accessToken, someSigMessage);
        await user.accountManager.unsubscribe();

    } catch (e) {
        console.log('check createUser', e);
        // ignore error if user not exist
    }

    return await user.accountManager.registration(pass, someSigMessage);
}

describe('External Services Manager', async () => {
    const headers: Map<string, Array<string>> = new Map<string, Array<string>>(
        [
            ['Accept', ['application/json']],
            ['Content-Type', ['application/json']],
            ['Strategy', ['POSTGRES']]
        ]
    );

    const userBase: Base = createBase();
    let userAccount: Account;
    let service: ExternalService;

    function createBase(): Base {
        return new Base(
            baseNodeUrl,
            'localhost',
            RepositoryStrategyType.Postgres,
            rpcSignerHost
        );
    }

    beforeEach(async () => {
        if (baseNodeUrl.includes('http://localhost')) {
            userAccount = await createUser(userBase, someSigMessage);

            const services = await userBase.externalServicesManager.getExternalServices();
            service = services.filter(item => item.endpoint.includes('http://localhost'))[0];
        } else {
            console.log('this test only use locally');
        }
    });

    after(async () => {
        // rpcClient.disconnect();
    });

    it('should be call request GET Account', async () => {
        if (!userAccount || !service) {
            return;
        }

        const call = new HttpServiceCall(
            service.publicKey,
            ServiceCallType.HTTP,
            HttpMethod.Get,
            '/v1/account/count',
            new Map(),
            headers
        );

        const result = await userBase.externalServicesManager.callExternalService(call);
        result.status.should.be.eq(200);
        Number(result.body).should.be.gt(0);
    });

    it('should be call request GET with query args', async () => {
        if (!userAccount || !service) {
            return;
        }

        const call = new HttpServiceCall(
            service.publicKey,
            ServiceCallType.HTTP,
            HttpMethod.Get,
            '/v1/search/count',
            new Map([['ids', '2785290']]),
            headers
        );

        const result = await userBase.externalServicesManager.callExternalService(call);
        result.status.should.be.eq(200);
        (result.body as object).hasOwnProperty('2785290').should.be.true;
    });

    // we have some strange behavior in convert JSON Object to Unrecognized Object with Number fields to POJO.
    // Number '0' will convert to Double '0.0' in GSON library.
    // PR for fix it https://github.com/google/gson/pull/1290
    it('should be call request POST', async () => {
        if (!userAccount || !service) {
            return;
        }

        const keypair = await keyPairHelper.createKeyPair('my super pass');
        const account = new Account(keypair.publicKey, 0);
        const sig = await keyPairHelper.signMessage(JSON.stringify(account.toSimpleAccount()));

        const body = new SignedRequest(
            account.toSimpleAccount(),
            keypair.publicKey,
            sig,
            0
        );

        const call = new HttpServiceCall(
            service.publicKey,
            ServiceCallType.HTTP,
            HttpMethod.Post,
            '/v1/registration',
            new Map(),
            headers,
            body
        );

        const result = await userBase.externalServicesManager.callExternalService(call);
        result.status.should.be.eq(403); // when fix GSON change to 201
        // Number(result.body).should.be.gt(0);
    });
});
