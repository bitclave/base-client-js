import Base, { CompareAction, Offer, OfferSearch, SearchRequest } from '../../src/Base';
import Account from '../../src/repository/models/Account';
import { BaseClientHelper } from '../BaseClientHelper';

require('chai')
    .use(require('chai-as-promised'))
    .should();

describe('Verify Manager', async () => {
    const passPhraseAlisa: string = 'Alice';
    const passPhraseSeller: string = 'Seller';

    let businessBase: Base;
    let baseAlice: Base;

    let accAlice: Account;

    const fromDate: Date = new Date();

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
        businessBase = await BaseClientHelper.createRegistered(passPhraseSeller);
        baseAlice = await BaseClientHelper.createRegistered(passPhraseAlisa);
        accAlice = baseAlice.accountManager.getAccount();
    });

    it('should get offer search list by ids', async () => {
        try {
            // Business:
            // create offer
            const offer = offerFactory();
            const businessOffer = await businessBase.offerManager.saveOffer(offer);

            const searchRequest = requestFactory();
            const insertedSearchRequest = await baseAlice.searchManager.createRequest(searchRequest);

            const offerSearch = new OfferSearch(insertedSearchRequest.id, businessOffer.id);
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
