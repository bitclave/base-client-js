import Base, { CompareAction, Offer, OfferSearch, SearchRequest } from '../../src/Base';
import Account from '../../src/repository/models/Account';
import { RepositoryStrategyType } from '../../src/repository/RepositoryStrategyType';
import { RpcTransport } from '../../src/repository/source/rpc/RpcTransport';
import { TransportFactory } from '../../src/repository/source/TransportFactory';
import AuthenticatorHelper from '../AuthenticatorHelper';

require('chai')
    .use(require('chai-as-promised'))
    .should();
const someSigMessage = 'some unique message for signature';
const baseNodeUrl = process.env.BASE_NODE_URL || 'https://base2-bitclva-com.herokuapp.com';
const rpcSignerHost = process.env.SIGNER || 'http://localhost:3545';
const rpcTransport: RpcTransport = TransportFactory.createJsonRpcHttpTransport(rpcSignerHost);
const authenticatorHelper: AuthenticatorHelper = new AuthenticatorHelper(rpcTransport);

async function createUser(user: Base, pass: string): Promise<Account> {
    const accessToken = await authenticatorHelper.generateAccessToken(pass);
    await user.accountManager.authenticationByAccessToken(accessToken, someSigMessage);
    await user.accountManager.unsubscribe();

    return await user.accountManager.authenticationByAccessToken(accessToken, someSigMessage);
}

describe('Verify Manager', async () => {
    const passPhraseAlisa: string = 'Alice';
    const passPhraseSeller: string = 'Seller';

    const businessBase: Base = createBase();
    const baseAlice: Base = createBase();

    let accAlice: Account;

    const fromDate: Date = new Date();

    function createBase(): Base {
        return new Base(
            baseNodeUrl,
            'localhost',
            RepositoryStrategyType.Postgres,
            rpcSignerHost
        );
    }

    function offerFactory(): Offer {
        const offerTags = new Map<string, string>([
            ['product', 'car'],
            ['color', 'red'],
            ['producer', 'mazda'],
            ['models', 'RX8']
        ]);
        const compareUserTag = new Map<string, string>([
            ['age', '10']
        ]);
        const rules = new Map<string, CompareAction>([
            ['age', CompareAction.MORE]
        ]);

        return new Offer(
            'it is offer description',
            'it is title of offer',
            '', '1', offerTags, compareUserTag, rules
        );
    }

    function requestFactory(): SearchRequest {
        return new SearchRequest(new Map([
            ['product', 'car'],
            ['color', 'red'],
            ['producer', 'mazda'],
            ['models', 'RX8']
        ]));

    }

    beforeEach(async () => {
        await createUser(businessBase, passPhraseSeller);
        accAlice = await createUser(baseAlice, passPhraseAlisa);
    });

    after(async () => {
        // rpcClient.disconnect();
    });

    it('should get offer search list by ids', async () => {
        try {
            // Business:
            // create offer
            const offer = offerFactory();
            const businessOffer = await businessBase.offerManager.saveOffer(offer);

            const searchRequest = requestFactory();
            const insertedSearchRequest = await baseAlice.searchManager.createRequest(searchRequest);

            const offerSearch = new OfferSearch(insertedSearchRequest.id, businessOffer.id, ['created']);
            await baseAlice.searchManager.addResultItem(offerSearch);

            const searchRequests = (await baseAlice.searchManager.getSearchResult(insertedSearchRequest.id)).content;
            searchRequests.length.should.be.eql(1);

            const offerSearches = await baseAlice.verifyManager
                .getOfferSearchesByIds([searchRequests[0].offerSearch.id]);

            offerSearches.length.should.be.equal(1);
        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it('should get user list by publickeys', async () => {
        try {
            const users = await baseAlice.verifyManager.getAccountsByPublicKeys([accAlice.publicKey]);
            users.length.should.be.equal(1);
        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it('should get all users', async () => {
        try {
            const users = await baseAlice.verifyManager.getAllAccounts(fromDate);
            users.length.should.be.greaterThan(1);
        } catch (e) {
            console.log(e);
            throw e;
        }
    });
});
