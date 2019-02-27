import Base from '../../src/Base';
import Account from '../../src/repository/models/Account';
import { TransportFactory } from '../../src/repository/source/TransportFactory';
import AuthenticatorHelper from '../AuthenticatorHelper';
import { RepositoryStrategyType } from '../../src/repository/RepositoryStrategyType';
import { RpcTransport } from '../../src/repository/source/rpc/RpcTransport';

const should = require('chai')
    .use(require('chai-as-promised'))
    .should();
const someSigMessage = 'some unique message for signature';
const baseNodeUrl = process.env.BASE_NODE_URL || 'https://base2-bitclva-com.herokuapp.com';
const rpcSignerHost = process.env.SIGNER || 'http://localhost:3545';
const rpcTransport: RpcTransport = TransportFactory.createJsonRpcHttpTransport(rpcSignerHost);
const authenticatorHelper: AuthenticatorHelper = new AuthenticatorHelper(rpcTransport);

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

    return await user.accountManager.registration(pass, someSigMessage); // this method private.
}

describe('Verify Manager', async () => {
    const passPhraseAlisa: string = 'Alice';

    const baseAlice: Base = createBase();

    var accAlice: Account;

    function createBase(): Base {
        return new Base(
            baseNodeUrl,
            'localhost',
            RepositoryStrategyType.Postgres,
            rpcSignerHost
        );
    }

    beforeEach(async () => {
       accAlice = await createUser(baseAlice, passPhraseAlisa);
    });

    after(async () => {
        // rpcClient.disconnect();
    });

    it('should get offer search list by ids', async () => {
        try {
            const offerSearches = await baseAlice.verfiyManager.getOfferSearchesByIds([1]);
            offerSearches.length.should.be.equal(0);
        } catch (e) {
            console.log(e);
            throw e;
        }
    });
});
