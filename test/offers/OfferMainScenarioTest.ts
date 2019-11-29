import Base, {
    CompareAction,
    Offer,
    OfferResultAction,
    OfferSearch,
    OfferShareDataRepository,
    SearchRequest,
    TransportFactory,
    WalletManagerImpl
} from '../../src/Base';
import Account from '../../src/repository/models/Account';
import { OfferPrice } from '../../src/repository/models/OfferPrice';
import { OfferPriceRules } from '../../src/repository/models/OfferPriceRules';
import OfferShareDataRepositoryImpl from '../../src/repository/offer/OfferShareDataRepositoryImpl';
import { BasicLogger } from '../../src/utils/BasicLogger';
import { AccessRight } from '../../src/utils/keypair/Permissions';
import { BaseClientHelper } from '../BaseClientHelper';

require('chai').use(require('chai-as-promised')).should();

describe('Offer main scenario', async () => {

    const passPhraseSeller: string = 'Seller';
    const passPhraseBusinessBuyer: string = 'Business';  // need 5 symbols

    let businessBase: Base;
    let userBase: Base;

    let businessAccount: Account;
    let offerShareDataRepository: OfferShareDataRepository;

    function offerFactory(isMultiPrices: boolean = false): Offer {
        const offerTags = new Map<string, string>(
            [
                ['product', 'car'],
                ['color', 'red'],
                ['producer', 'mazda'],
                ['models', 'RX8']
            ]
        );
        const compareUserTag = new Map<string, string>([['age', '10']]);
        const rules = new Map<string, CompareAction>([['age', CompareAction.MORE]]);
        const offer = new Offer(
            'it is offer description',
            'it is title of offer',
            '', '1', offerTags, compareUserTag, rules
        );
        if (isMultiPrices) {
            offer.offerPrices = [
                new OfferPrice(
                    0, 'special price for 40 and 50 years old male customers', '1.5', [
                        new OfferPriceRules(0, 'sex', 'male', CompareAction.EQUALLY),
                        new OfferPriceRules(0, 'age', '40', CompareAction.EQUALLY)
                    ]
                ),
                new OfferPrice(
                    0, 'special price for 40 and 50 years old male customers', '1.7', [
                        new OfferPriceRules(0, 'sex', 'male', CompareAction.EQUALLY),
                        new OfferPriceRules(0, 'age', '40', CompareAction.EQUALLY),
                        new OfferPriceRules(0, 'country', 'USA', CompareAction.EQUALLY)
                    ]
                ),
                new OfferPrice(
                    0, 'special price for young girls customers < 15', '0.9', [
                        new OfferPriceRules(0, 'sex', 'female', CompareAction.EQUALLY),
                        new OfferPriceRules(0, 'age', '15', CompareAction.LESS)
                    ]
                ),
                new OfferPrice(
                    0, 'special price for old men USA customers', '0.7', [
                        new OfferPriceRules(0, 'age', '70', CompareAction.MORE_OR_EQUAL),
                        new OfferPriceRules(0, 'country', 'USA', CompareAction.EQUALLY)
                    ]
                )
            ];
        }

        return offer;
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
        businessBase = await BaseClientHelper.createRegistered(passPhraseSeller);
        businessAccount = businessBase.accountManager.getAccount();
        const transport = TransportFactory.createHttpTransport(BaseClientHelper.getBaseNodeUrl(), new BasicLogger());

        offerShareDataRepository = new OfferShareDataRepositoryImpl(
            transport,
            businessBase.accountManager,
            businessBase.profileManager
        );

        userBase = await BaseClientHelper.createRegistered(passPhraseBusinessBuyer);
    });

    after(async () => {
        // rpcClient.disconnect();
    });

    it('should select offer, price, confirmed and share data', async () => {
        try {

            // Business:
            // create offer
            const offer = offerFactory(true);
            const businessOffer = await businessBase.offerManager.saveOffer(offer);

            // User:
            // create user private data and upload ones to server
            await userBase.profileManager.updateData(new Map([['age', '40']]));
            await userBase.profileManager.updateData(new Map([['sex', 'male']]));

            // User:
            // create search request and upload one to server
            const request = requestFactory();
            const userSearchRequest = await userBase.searchManager.createRequest(request);

            // User:
            // retrieve private data
            const userData = await userBase.profileManager.getData();

            // External Matcher:
            // match the offer and the searchRequest
            const offerSearch = new OfferSearch(userSearchRequest.id, businessOffer.id);
            await userBase.searchManager.addResultItem(offerSearch);

            // User:
            // get OfferSearch (matched offer and searchRequesr data)
            // select a proper offer
            const searchResults = (await userBase.searchManager.getSearchResult(userSearchRequest.id)).content;
            const searchResult: OfferSearch = searchResults[0].offerSearch;

            // User:
            // get valid prices from the offer price list
            const prices = businessOffer.validPrices(userData);

            // User:
            // select manually one price
            const onePrice = prices[0];

            // User:
            // grants access to data for business by offer rule keys
            const acceptedFields = onePrice.getFieldsForAcception(AccessRight.R);
            acceptedFields.set(WalletManagerImpl.DATA_KEY_CRYPTO_WALLETS, AccessRight.R);
            const pkBusiness = businessAccount.publicKey;
            await userBase
                .dataRequestManager
                .grantAccessForOffer(searchResult.id, pkBusiness, acceptedFields, onePrice.id);

            // BUSINESS:
            // get shared data
            const offerShare = await offerShareDataRepository.getShareData(pkBusiness, false);
            const offerShareData = offerShare[0];

            const price = offerShareData.worth;
            price.should.be.eql('1.5');

        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it('should add events to offerSearch', async () => {
        try {
            // Business:
            // create offer
            const offer = offerFactory(true);
            const businessOffer = await businessBase.offerManager.saveOffer(offer);

            // User:
            // create user private data and upload ones to server
            await userBase.profileManager.updateData(new Map([['age', '40']]));
            await userBase.profileManager.updateData(new Map([['sex', 'male']]));

            // User:
            // create search request and upload one to server
            const request = requestFactory();
            const userSearchRequest = await userBase.searchManager.createRequest(request);

            // External Matcher:
            // match the offer and the searchRequest
            const offerSearch = new OfferSearch(userSearchRequest.id, businessOffer.id);
            await userBase.searchManager.addResultItem(offerSearch);

            // User:
            // get OfferSearch (matched offer and searchRequesr data)
            // select a proper offer
            const searchResults = (await userBase.searchManager.getSearchResult(userSearchRequest.id)).content;
            const searchResult: OfferSearch = searchResults[0].offerSearch;

            await userBase.searchManager.addEventToOfferSearch('tram-param-pam', searchResult.id);
            await userBase.searchManager.addEventToOfferSearch('ta-da-bada', searchResult.id);
            const updated = (await userBase.searchManager.getInteractions());

            updated[0].events[0].should.be.eql('tram-param-pam');
            updated[0].events[1].should.be.eql('ta-da-bada');

            const byOfferId = (await userBase.searchManager.getInteractions([updated[0].offerId]));
            byOfferId.length.should.be.eq(1);
            byOfferId[0].offerId.should.be.eq(updated[0].offerId);

            const byState = (await userBase.searchManager.getInteractions([], [OfferResultAction.NONE]));
            byState.length.should.be.eq(1);
            byState[0].state.should.be.eq(updated[0].state);

            const byStateAndOffer = (await userBase.searchManager.getInteractions(
                [updated[0].offerId],
                [OfferResultAction.NONE]
            ));
            byStateAndOffer.length.should.be.eq(1);
            byStateAndOffer[0].offerId.should.be.eq(updated[0].offerId);
            byStateAndOffer[0].state.should.be.eq(updated[0].state);

        } catch (e) {
            console.log(e);
            throw e;
        }
    });
});
