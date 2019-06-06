// tslint:disable:no-unused-expression
import Base, {
    CompareAction,
    Offer,
    OfferPrice,
    OfferResultAction,
    OfferSearch,
    OfferSearchRequestInterestMode,
    SearchRequest
} from '../../src/Base';
import { SortOfferSearch } from '../../src/manager/SearchManager';
import Account from '../../src/repository/models/Account';
import { RepositoryStrategyType } from '../../src/repository/RepositoryStrategyType';
import { TransportFactory } from '../../src/repository/source/TransportFactory';
import AuthenticatorHelper from '../AuthenticatorHelper';

require('chai').use(require('chai-as-promised')).should();
const someSigMessage = 'some unique message for signature';

const baseNodeUrl = process.env.BASE_NODE_URL || 'https://base2-bitclva-com.herokuapp.com';
const rpcSignerHost = process.env.SIGNER || 'http://localhost:3545';

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

    const passPhraseSeller: string = 'Seller user1 pass special for Search Manager tests';
    const passPhraseBusinessBuyer: string = 'Business user2 pass special for Search Manager tests';

    const businessBase: Base = createBase();
    const userBase: Base = createBase();

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
        const offerTags = new Map<string, string>(
            [
                ['product', 'car'],
                ['color', 'red'],
                ['producer', 'mazda'],
                ['models', 'RX8']
            ]
        );
        const compareUserTag = new Map<string, string>(
            [
                ['age', '10']
            ]
        );

        const rules = new Map<string, CompareAction>(
            [
                ['age', CompareAction.MORE]
            ]
        );

        return new Offer(
            'it is offer description',
            'it is title of offer',
            '', '1', offerTags, compareUserTag, rules
        );
    }

    function requestFactory(): SearchRequest {
        return new SearchRequest(new Map(
            [
                ['product', 'car'],
                ['color', 'red'],
                ['producer', 'mazda'],
                ['models', 'RX8']
            ]
        ));

    }

    beforeEach(async () => {
        await createUser(businessBase, passPhraseSeller);
        userAccount = await createUser(userBase, passPhraseBusinessBuyer);
    });
    after(async () => {
        // rpcClient.disconnect();
    });

    it('should CRUD Search Request', async () => {
        try {

            const searchRequest = requestFactory();
            const insertedSearchRequest = await userBase.searchManager.createRequest(searchRequest);

            let searchRequests = await userBase.searchManager.getMyRequests(0);

            searchRequests.length.should.be.eql(1);

            insertedSearchRequest.tags = new Map(
                [
                    ['product', 'car'],
                    ['color', 'blue'],
                    ['producer', 'mazda'],
                    ['models', 'RX8']
                ]
            );

            const updatedSearchRequest = await userBase.searchManager.updateRequest(insertedSearchRequest);

            searchRequests = await userBase.searchManager.getMyRequests(updatedSearchRequest.id);
            searchRequests.length.should.be.eql(1);
            (searchRequests[0].tags.get('color') as string).should.be.eql('blue');

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
            await userBase.searchManager.createRequest(searchRequest);
            await userBase.searchManager.createRequest(searchRequest);

            let searchRequests = await userBase.searchManager.getAllRequests();
            searchRequests.length.should.be.gte(2);

            searchRequests = await userBase.searchManager.getMySearchRequestsByTag('product');
            searchRequests.length.should.be.eql(2);

            searchRequests = await userBase.searchManager.getSearchRequestsByOwnerAndTag(
                userAccount.publicKey,
                'product'
            );
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

            const offerSearch = new OfferSearch(insertedSearchRequest.id, businessOffer.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch);

            let searchRequests = (await userBase.searchManager.getSearchResult(insertedSearchRequest.id)).content;
            searchRequests.length.should.be.eql(1);

            searchRequests = (await userBase.searchManager
                .getSearchResultByOfferSearchId(searchRequests[0].offerSearch.id)).content;

            searchRequests.length.should.be.eql(1);

            searchRequests = (await userBase.searchManager.getUserOfferSearches(
                0, 10, true, [], [], SortOfferSearch.updatedAt
            )).content;
            searchRequests.length.should.be.eql(1);

            await userBase.searchManager.addEventToOfferSearch('updated', searchRequests[0].offerSearch.id);
            searchRequests = (await userBase.searchManager.getUserOfferSearches(
                0, 10, true, [], [], SortOfferSearch.updatedAt
            )).content;
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

            const offerSearch = new OfferSearch(insertedSearchRequest.id, businessOffer.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch);
            let searchRequests = await getSearchRequests();
            searchRequests.length.should.be.eql(1);

            await userBase.searchManager.claimPurchaseForSearchItem(searchRequests[0].offerSearch.id);
            searchRequests.length.should.be.eql(1);
            searchRequests = await getSearchRequests();
            searchRequests.length.should.be.eql(1);
            searchRequests[0].offerSearch.state.should.be.eql(OfferResultAction.CLAIMPURCHASE);

            await userBase.searchManager.complainToSearchItem(searchRequests[0].offerSearch.id);
            searchRequests.length.should.be.eql(1);
            searchRequests = await getSearchRequests();
            searchRequests.length.should.be.eql(1);
            searchRequests[0].offerSearch.state.should.be.eql(OfferResultAction.COMPLAIN);

            await userBase.searchManager.evaluateSearchItem(searchRequests[0].offerSearch.id);
            searchRequests.length.should.be.eql(1);
            searchRequests = await getSearchRequests();
            searchRequests.length.should.be.eql(1);
            searchRequests[0].offerSearch.state.should.be.eql(OfferResultAction.EVALUATE);

            await userBase.searchManager.rejectSearchItem(searchRequests[0].offerSearch.id);
            searchRequests.length.should.be.eql(1);
            searchRequests = await getSearchRequests();
            searchRequests.length.should.be.eql(1);
            searchRequests[0].offerSearch.state.should.be.eql(OfferResultAction.REJECT);

            await businessBase.searchManager.confirmSearchItem(searchRequests[0].offerSearch.id);
            searchRequests.length.should.be.eql(1);
            searchRequests = await getSearchRequests();
            searchRequests.length.should.be.eql(1);
            searchRequests[0].offerSearch.state.should.be.eql(OfferResultAction.CONFIRMED);

            async function getSearchRequests() {
                return (await userBase.searchManager.getUserOfferSearches(
                    0, 10, true, [], [], SortOfferSearch.updatedAt
                )).content;
            }

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

            const offerSearch = new OfferSearch(insertedSearchRequest.id, businessOffer.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch);

            let searchRequests = (await userBase.searchManager.getSearchResult(insertedSearchRequest.id)).content;
            searchRequests.length.should.be.eql(1);

            const clonedSearchRequest = await userBase.searchManager.cloneRequest(insertedSearchRequest);
            clonedSearchRequest.should.be.exist;

            searchRequests = (await userBase.searchManager.getSearchResult(clonedSearchRequest.id)).content;
            searchRequests.length.should.be.eql(1);

            const clonedSearchRequest2 = await userBase.searchManager.cloneOfferSearch(
                clonedSearchRequest.id,
                searchRequest
            );
            clonedSearchRequest2.length.should.be.eql(1);
            clonedSearchRequest2[0].offerId.should.be.eql(businessOffer.id);
            clonedSearchRequest2[0].id.should.not.eql(searchRequests[0].offerSearch.id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it ('should return offerSerches sorted by updateAt', async () => {
        try {
            const offer = offerFactory();

            offer.title = '2';
            const createdOffer2 = await userBase.offerManager.saveOffer(offer);
            await pauseSeconds(1);

            offer.title = '3';
            const createdOffer3 = await userBase.offerManager.saveOffer(offer);
            await pauseSeconds(1);

            offer.title = '1';
            const createdOffer1 = await userBase.offerManager.saveOffer(offer);

            const searchRequest = requestFactory();
            const createdSearchRequest = await userBase.searchManager.createRequest(searchRequest);

            const offerSearch1 = new OfferSearch(createdSearchRequest.id, createdOffer1.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch1);

            const offerSearch2 = new OfferSearch(createdSearchRequest.id, createdOffer2.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch2);

            const offerSearch3 = new OfferSearch(createdSearchRequest.id, createdOffer3.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch3);

            const searchRequests = await userBase
                .searchManager
                .getUserOfferSearches(0, 5, false, [], [], SortOfferSearch.updatedAt);

            const content = searchRequests.content;
            content.length.should.be.eql(3);
            content[0].offer.title.should.be.eql('1');
            content[1].offer.title.should.be.eql('3');
            content[2].offer.title.should.be.eql('2');
        } catch (err) {
            console.error(err);
        }
        async function pauseSeconds(sec: number): Promise<{}> {
            return new Promise(resolve => setTimeout(resolve, sec * 1000));
        }
    });

    it ('should return offerSerches with price sorting', async () => {
        try {
            const offer = offerFactory();

            offer.title = '1';
            offer.offerPrices = [new OfferPrice(0, 'description 100', '100')];
            const createdOffer1 = await userBase.offerManager.saveOffer(offer);

            offer.title = '2';
            offer.offerPrices = [new OfferPrice(0, 'description 120', '120')];
            const createdOffer2 = await userBase.offerManager.saveOffer(offer);

            offer.title = '3';
            offer.offerPrices = [new OfferPrice(0, 'description 110', '110')];
            const createdOffer3 = await userBase.offerManager.saveOffer(offer);

            offer.title = '4';
            offer.offerPrices = [new OfferPrice(0, 'description 1000', '1000')];
            const createdOffer4 = await userBase.offerManager.saveOffer(offer);

            const searchRequest = requestFactory();
            const createdSearchRequest = await userBase.searchManager.createRequest(searchRequest);

            const offerSearch1 = new OfferSearch(createdSearchRequest.id, createdOffer1.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch1);

            const offerSearch2 = new OfferSearch(createdSearchRequest.id, createdOffer2.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch2);

            const offerSearch3 = new OfferSearch(createdSearchRequest.id, createdOffer3.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch3);

            const offerSearch4 = new OfferSearch(createdSearchRequest.id, createdOffer4.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch4);

            const searchRequests = await userBase.searchManager
                .getUserOfferSearches(0, 5, false, [], [], SortOfferSearch.price);

            const content = searchRequests.content;
            content.length.should.be.eql(4);
            content[0].offer.title.should.be.eql('4');
            content[1].offer.title.should.be.eql('2');
            content[2].offer.title.should.be.eql('3');
            content[3].offer.title.should.be.eql('1');

        } catch (err) {
            console.error(err);
            throw err;
        }
        async function pauseSeconds(sec: number): Promise<{}> {
            return new Promise(resolve => setTimeout(resolve, sec * 1000));
        }
    });

    it ('should return offerSerches by searchRequest ids with price sorting', async () => {
        try {
            const offer = offerFactory();

            offer.title = '1';
            offer.offerPrices = [new OfferPrice(0, 'description 100', '100')];
            const createdOffer1 = await userBase.offerManager.saveOffer(offer);

            offer.title = '2';
            offer.offerPrices = [new OfferPrice(0, 'description 120', '120')];
            const createdOffer2 = await userBase.offerManager.saveOffer(offer);

            offer.title = '3';
            offer.offerPrices = [new OfferPrice(0, 'description 110', '110')];
            const createdOffer3 = await userBase.offerManager.saveOffer(offer);

            offer.title = '4';
            offer.offerPrices = [new OfferPrice(0, 'description 1000', '1000')];
            const createdOffer4 = await userBase.offerManager.saveOffer(offer);

            const searchRequest1 = requestFactory();
            const createdSearchRequest1 = await userBase.searchManager.createRequest(searchRequest1);

            const searchRequest2 = requestFactory();
            const createdSearchRequest2 = await userBase.searchManager.createRequest(searchRequest2);

            const offerSearch1 = new OfferSearch(createdSearchRequest1.id, createdOffer1.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch1);

            const offerSearch2 = new OfferSearch(createdSearchRequest2.id, createdOffer2.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch2);

            const offerSearch3 = new OfferSearch(createdSearchRequest2.id, createdOffer3.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch3);

            const offerSearch4 = new OfferSearch(createdSearchRequest1.id, createdOffer4.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch4);

            const searchRequests = await userBase.searchManager
                .getUserOfferSearches(0, 5, false, [createdSearchRequest1.id], [], SortOfferSearch.price);

            const content = searchRequests.content;
            content.length.should.be.eql(2);
            content[0].offer.title.should.be.eql('4');
            content[1].offer.title.should.be.eql('1');

        } catch (err) {
            console.error(err);
            throw err;
        }
        async function pauseSeconds(sec: number): Promise<{}> {
            return new Promise(resolve => setTimeout(resolve, sec * 1000));
        }
    });

    it ('should return offerSerches by state with price sorting', async () => {
        try {
            const offer = offerFactory();

            offer.title = '1';
            offer.offerPrices = [new OfferPrice(0, 'description 100', '100')];
            const createdOffer1 = await userBase.offerManager.saveOffer(offer);

            offer.title = '2';
            offer.offerPrices = [new OfferPrice(0, 'description 120', '120')];
            const createdOffer2 = await userBase.offerManager.saveOffer(offer);

            offer.title = '3';
            offer.offerPrices = [new OfferPrice(0, 'description 110', '110')];
            const createdOffer3 = await userBase.offerManager.saveOffer(offer);

            offer.title = '4';
            offer.offerPrices = [new OfferPrice(0, 'description 1000', '1000')];
            const createdOffer4 = await userBase.offerManager.saveOffer(offer);

            const searchRequest1 = requestFactory();
            const createdSearchRequest1 = await userBase.searchManager.createRequest(searchRequest1);

            const offerSearch1 = new OfferSearch(createdSearchRequest1.id, createdOffer1.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch1);

            const offerSearch2 = new OfferSearch(createdSearchRequest1.id, createdOffer2.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch2);

            const offerSearch3 = new OfferSearch(createdSearchRequest1.id, createdOffer3.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch3);

            const offerSearch4 = new OfferSearch(createdSearchRequest1.id, createdOffer4.id, ['created']);
            await userBase.searchManager.addResultItem(offerSearch4);

            const searchRequests1 = await userBase.searchManager
                .getUserOfferSearches(0, 5, false, [], [], SortOfferSearch.price);

            const content1 = searchRequests1.content;
            content1.length.should.be.eql(4);
            content1[0].offer.title.should.be.eql('4');
            content1[1].offer.title.should.be.eql('2');
            content1[2].offer.title.should.be.eql('3');
            content1[3].offer.title.should.be.eql('1');

            await userBase.searchManager.confirmSearchItem(content1[0].offerSearch.id );
            await userBase.searchManager.confirmSearchItem(content1[2].offerSearch.id );

            const searchRequests = await userBase.searchManager
                .getUserOfferSearches(0, 5, false, [], [OfferResultAction.CONFIRMED], SortOfferSearch.price);

            const content = searchRequests.content;
            content.length.should.be.eql(2);
            content[0].offer.title.should.be.eql('4');
            content[1].offer.title.should.be.eql('3');

        } catch (err) {
            console.error(err);
            throw err;
        }
        async function pauseSeconds(sec: number): Promise<{}> {
            return new Promise(resolve => setTimeout(resolve, sec * 1000));
        }
    });
});

describe('search manager with search by query', async () => {
    const passPhraseUser: string = 'User for search by query only';
    const userBase: Base = createBase();
    let userAccount: Account;
    function createBase(): Base {
        return new Base(
            baseNodeUrl,
            'localhost',
            RepositoryStrategyType.Postgres,
            rpcSignerHost
        );
    }
    function requestFactory(): SearchRequest {
        return new SearchRequest(new Map(
            [
                ['product', 'car'],
                ['color', 'red'],
                ['producer', 'mazda'],
                ['models', 'RX8']
            ]
        ));
    }
    beforeEach(async () => {
        userAccount = await createUser(userBase, passPhraseUser);
    });
    it('should return 200 in search results ranked by interests (only endpoint tested no data)', async () => {
        try {
            let rtSearchRequests = await userBase.searchManager.getMySearchRequestsByTag('rtSearch');
            if (!rtSearchRequests || !rtSearchRequests.length) {
                const searchRequest = requestFactory();
                searchRequest.tags = new Map([['rtSearch', 'true']]);
                rtSearchRequests = [await userBase.searchManager.createRequest(searchRequest)];
            }

            const result = await userBase.searchManager.createSearchResultByQuery(
                'golf', rtSearchRequests[0].id, 0, 10,
                ['interest_sports', 'interest_department_stores', 'interest_consumer_electronics'],
                OfferSearchRequestInterestMode.prefer
            );
            result.should.be.exist;
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
    it('should return 200 search results filtered by interests (only endpoint tested no data)', async () => {
        try {
            let rtSearchRequests = await userBase.searchManager.getMySearchRequestsByTag('rtSearch');
            if (!rtSearchRequests || !rtSearchRequests.length) {
                const searchRequest = requestFactory();
                searchRequest.tags = new Map([['rtSearch', 'true']]);
                rtSearchRequests = [await userBase.searchManager.createRequest(searchRequest)];
            }
            const result = await userBase.searchManager.createSearchResultByQuery(
                '*', rtSearchRequests[0].id, 0, 10,
                ['interest_health_&_wellness', 'interest_home,_garden', 'interest_consumer_electronics'],
                OfferSearchRequestInterestMode.must
            );
            result.should.be.exist;
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
});
