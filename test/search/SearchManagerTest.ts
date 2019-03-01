import Base, { Offer, CompareAction, SearchRequest, OfferSearch, OfferResultAction } from '../../src/Base';
import Account from '../../src/repository/models/Account';
import { TransportFactory } from '../../src/repository/source/TransportFactory';
import AuthenticatorHelper from '../AuthenticatorHelper';
import { RepositoryStrategyType } from '../../src/repository/RepositoryStrategyType';

const should = require('chai').use(require('chai-as-promised')).should();
const someSigMessage = 'some unique message for signature';

const baseNodeUrl = process.env.BASE_NODE_URL || 'https://base2-bitclva-com.herokuapp.com';
const rpcSignerHost = process.env.SIGNER || 'http://localhost:3545';

const httpTransport = TransportFactory.createHttpTransport(baseNodeUrl);
const rpcTransport = TransportFactory.createJsonRpcHttpTransport(rpcSignerHost);
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

describe('Search Manager', async () => {

    const passPhraseSeller: string = 'Seller';
    const passPhraseBusinessBuyer: string = 'Business';  // need 5 symbols

    const businessBase: Base = createBase();
    const userBase: Base = createBase();

    let businessAccount: Account;
    let userAccount: Account;

    function createBase(): Base {
        return new Base(
            baseNodeUrl,
            'localhost',
            RepositoryStrategyType.Postgres,
            rpcSignerHost
        );
    }
    function offerFactory(): Offer {
        const offerTags = new Map<String, String>([
          ['product', 'car'],
          ['color', 'red'],
          ['producer', 'mazda'],
          ['models', 'RX8']
        ]);
        const compareUserTag = new Map<String, String>([
            ['age', '10']
        ]);
        const rules = new Map<String, CompareAction>([
            ['age', CompareAction.MORE]
        ]);
        const offer = new Offer(
          'it is offer description',
          'it is title of offer',
          '', '1', offerTags, compareUserTag, rules
        );
        return offer;
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
        businessAccount = await createUser(businessBase, passPhraseSeller);
        userAccount = await createUser(userBase, passPhraseBusinessBuyer);
    });
    after(async () => {
        // rpcClient.disconnect();
    });

    it('should CRUD Search Request', async () => {
        try {

            const searchRequest = requestFactory();
            let insertedSearchRequest = await userBase.searchManager.createRequest(searchRequest);

            let searchRequests = await userBase.searchManager.getMyRequests(0);

            searchRequests.length.should.be.eql(1);

            insertedSearchRequest.tags = new Map([
                    ['product', 'car'],
                    ['color', 'blue'],
                    ['producer', 'mazda'],
                    ['models', 'RX8']
                ]);

            let updatedSearchRequest = await userBase.searchManager.updateRequest(insertedSearchRequest);

            searchRequests = await userBase.searchManager.getMyRequests(updatedSearchRequest.id);
            searchRequests.length.should.be.eql(1);
            searchRequests[0].tags.get('color').should.be.eql('blue');

            await userBase.searchManager.deleteRequest(updatedSearchRequest.id);
            searchRequests = await userBase.searchManager.getMyRequests(updatedSearchRequest.id);
            searchRequests.length.should.be.eql(0);

        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it('should search Search Requests', async () => {
        try {

            const searchRequest = requestFactory();
            let insertedSearchRequest = await userBase.searchManager.createRequest(searchRequest);
            insertedSearchRequest = await userBase.searchManager.createRequest(searchRequest);

            let searchRequests = await userBase.searchManager.getAllRequests();
            searchRequests.length.should.be.gte(2);

            searchRequests = await userBase.searchManager.getMySearchRequestsByTag('product');
            searchRequests.length.should.be.eql(2);

            searchRequests = await userBase.searchManager.getSearchRequestsByOwnerAndTag(userAccount.publicKey, 'product');
            searchRequests.length.should.be.eql(2);

        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it('should Offer Search logic work', async () => {
        try {
            // Business:
            // create offer
            const offer = offerFactory();
            const businessOffer = await businessBase.offerManager.saveOffer(offer);
            
            const searchRequest = requestFactory();
            const insertedSearchRequest = await userBase.searchManager.createRequest(searchRequest);

            let offerSearch = new OfferSearch(insertedSearchRequest.id, businessOffer.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch);

            let searchRequests = await userBase.searchManager.getSearchResult(insertedSearchRequest.id);
            searchRequests.length.should.be.eql(1);

            searchRequests = await userBase.searchManager.getSearchResultByOfferSearchId(searchRequests[0].offerSearch.id);
            searchRequests.length.should.be.eql(1);

            searchRequests = await userBase.searchManager.getUserOfferSearches();
            searchRequests.length.should.be.eql(1);

            await userBase.searchManager.addEventToOfferSearch('updated', searchRequests[0].offerSearch.id);
            searchRequests = await userBase.searchManager.getUserOfferSearches();
            searchRequests.length.should.be.eql(1);
            searchRequests[0].offerSearch.events.length.should.be.eql(2);

        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it('should change Offer Search state', async () => {
        try {
            // Business:
            // create offer
            const offer = offerFactory();
            const businessOffer = await businessBase.offerManager.saveOffer(offer);
            
            const searchRequest = requestFactory();
            const insertedSearchRequest = await userBase.searchManager.createRequest(searchRequest);

            let offerSearch = new OfferSearch(insertedSearchRequest.id, businessOffer.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch);
            let searchRequests = await userBase.searchManager.getUserOfferSearches();
            searchRequests.length.should.be.eql(1);

            await userBase.searchManager.claimPurchaseForSearchItem(searchRequests[0].offerSearch.id);
            searchRequests.length.should.be.eql(1);
            searchRequests = await userBase.searchManager.getUserOfferSearches();
            searchRequests.length.should.be.eql(1);
            searchRequests[0].offerSearch.state.should.be.eql(OfferResultAction.CLAIMPURCHASE);

            await userBase.searchManager.complainToSearchItem(searchRequests[0].offerSearch.id);
            searchRequests.length.should.be.eql(1);
            searchRequests = await userBase.searchManager.getUserOfferSearches();
            searchRequests.length.should.be.eql(1);
            searchRequests[0].offerSearch.state.should.be.eql(OfferResultAction.COMPLAIN);

            await userBase.searchManager.evaluateSearchItem(searchRequests[0].offerSearch.id);
            searchRequests.length.should.be.eql(1);
            searchRequests = await userBase.searchManager.getUserOfferSearches();
            searchRequests.length.should.be.eql(1);
            searchRequests[0].offerSearch.state.should.be.eql(OfferResultAction.EVALUATE);

            await userBase.searchManager.rejectSearchItem(searchRequests[0].offerSearch.id);
            searchRequests.length.should.be.eql(1);
            searchRequests = await userBase.searchManager.getUserOfferSearches();
            searchRequests.length.should.be.eql(1);
            searchRequests[0].offerSearch.state.should.be.eql(OfferResultAction.REJECT);

            await businessBase.searchManager.confirmSearchItem(searchRequests[0].offerSearch.id);
            searchRequests.length.should.be.eql(1);
            searchRequests = await userBase.searchManager.getUserOfferSearches();
            searchRequests.length.should.be.eql(1);
            searchRequests[0].offerSearch.state.should.be.eql(OfferResultAction.CONFIRMED);

        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it('should clone Search Request and Offer Search', async () => {
        try {
            // Business:
            // create offer
            const offer = offerFactory();
            const businessOffer = await businessBase.offerManager.saveOffer(offer);
            
            const searchRequest = requestFactory();
            const insertedSearchRequest = await userBase.searchManager.createRequest(searchRequest);

            let offerSearch = new OfferSearch(insertedSearchRequest.id, businessOffer.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch);

            let searchRequests = await userBase.searchManager.getSearchResult(insertedSearchRequest.id);
            searchRequests.length.should.be.eql(1);

            const clonedSearchRequest = await userBase.searchManager.cloneRequest(insertedSearchRequest);
            clonedSearchRequest.should.exist;

            searchRequests = await userBase.searchManager.getSearchResult(clonedSearchRequest.id);
            searchRequests.length.should.be.eql(1);

            const clonedSearchRequest2 = await userBase.searchManager.cloneOfferSearch(clonedSearchRequest.id, searchRequest);
            clonedSearchRequest2.length.should.be.eql(1);
            clonedSearchRequest2[0].offerId.should.be.eql(businessOffer.id);
            clonedSearchRequest2[0].id.should.not.eql(searchRequests[0].offerSearch.id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    });

});
