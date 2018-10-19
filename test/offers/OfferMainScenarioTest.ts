import Base, { Offer, CompareAction, SearchRequest, OfferResultAction, OfferSearch } from '../../src/Base';
import Account from '../../src/repository/models/Account';
import { CryptoUtils } from '../../src/utils/CryptoUtils';
import DataRequest from '../../src/repository/models/DataRequest';
import { TransportFactory } from '../../src/repository/source/TransportFactory';
import { WealthPtr, WealthRecord } from '../../src/utils/types/BaseTypes';
import AuthenticatorHelper from '../AuthenticatorHelper';
import { RepositoryStrategyType } from '../../src/repository/RepositoryStrategyType';
import { WalletManager } from '../../src/manager/WalletManager';
import { WalletUtils, WalletVerificationStatus } from '../../src/utils/WalletUtils';
import { AccessRight } from '../../src/utils/keypair/Permissions';
import { WalletManagerImpl } from '../../src/manager/WalletManagerImpl';
import { RpcTransport } from '../../src/repository/source/rpc/RpcTransport';
import { OfferPrice } from '../../src/repository/models/OfferPrice';
import { OfferPriceRules } from '../../src/repository/models/OfferPriceRules';
import OfferShareDataRepositoryImpl from './../../src/repository/offer/OfferShareDataRepositoryImpl';
import { OfferShareDataRepository } from './../../src/repository/offer/OfferShareDataRepository';

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

describe('Offer main scenario', async () => {

    const passPhraseSeller: string = 'Seller';
    const passPhraseBusinessBuyer: string = 'Business';  // need 5 symbols

    const businessBase: Base = createBase();
    const userBase: Base = createBase();

    // tslint:disable-next-line:max-line-length
    const offerShareDataRepository = new OfferShareDataRepositoryImpl(httpTransport, businessBase.accountManager, businessBase.profileManager);

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
    function offerFactory(isMultiPrices: boolean = false): Offer {
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

    // it.only('should select offer, price, confirmed and share data', async () => {
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
            const searchResults = await userBase.searchManager.getSearchResult(userSearchRequest.id);
            const searchResult: OfferSearch = searchResults[0].offerSearch;
            const selectedOffer: Offer = searchResults[0].offer;

            // User:
            // get valid prices from the offer price list
            const prices = businessOffer.validPrices(userData);

            // User:
            // select manually one price
            const onePrice = prices[0];

            // User:
            // grants access to data for business by offer rule keys
            const acceptedFields = onePrice.getFieldsForAcception(AccessRight.R);
            acceptedFields.set('eth_wallets', AccessRight.R);
            const pkBusiness = businessAccount.publicKey;
            await userBase
                .dataRequestManager
                .grantAccessForOffer(searchResult.id, pkBusiness, acceptedFields, onePrice.id);

            // BUSINESS:
            // get shared data
            const offerShare = await offerShareDataRepository.getShareData(pkBusiness, false);
            const offerShareData = offerShare[0];
            // get client data
            const clientData = await businessBase.profileManager
                .getAuthorizedData(offerShareData.clientId, offerShareData.clientResponse);

            const price =  offerShareData.worth;
            price.should.be.eql('1.5');

        } catch (e) {
            console.log(e);
            throw e;
        }
    });
});
