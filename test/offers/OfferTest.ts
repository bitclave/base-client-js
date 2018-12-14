import Base, { Offer, CompareAction } from '../../src/Base';
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

const should = require('chai').use(require('chai-as-promised')).should();
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
        //ignore error if user not exist
    }

    return await user.accountManager.registration(pass, someSigMessage); // this method private.
}

describe('Offer CRUD', async () => {
    const passPhraseSeller: string = 'Seller';
    const passPhraseBusinessBuyer: string = 'Business';  // need 5 symbols

    const baseSeller: Base = createBase();
    const baseBusinessBuyer: Base = createBase();

    let seller: Account;
    let buyer: Account;

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
          ['product', 'car']
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
                        new OfferPriceRules(0, 'age', '40', CompareAction.EQUALLY),
                        new OfferPriceRules(0, 'age', '50', CompareAction.EQUALLY)
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
    beforeEach(async () => {
        seller = await createUser(baseSeller, passPhraseSeller);
        buyer = await createUser(baseBusinessBuyer, passPhraseBusinessBuyer);
        // buyer2 = await createUser(baseBusinessBuyer2, passPhraseBusinessBuyer2);
        // buyer3 = await createUser(baseBusinessBuyer3, passPhraseBusinessBuyer3);
    });

    after(async () => {
        // rpcClient.disconnect();
    });

    it('should create simple offer', async () => {
        try {
            const offer = offerFactory();
            const createdOffer = await baseSeller.offerManager.saveOffer(offer);
            createdOffer.id.should.exist;
        } catch (e) {
            console.log(e);
            throw e;
        }
    });
    it('should create offer with multiprice', async () => {
        try {
            const offer = offerFactory(true);
            const createdOffer = await baseSeller.offerManager.saveOffer(offer);
            createdOffer.id.should.exist;
        } catch (e) {
            console.log(e);
            throw e;
        }
    });
    it('should update existed offer with multiprice', async () => {
        try {
            const updatedTitle = 'updated title';
            const updatedPriceDescription = 'new price description';

            const offer = offerFactory(true);
            const createdOffer = await baseSeller.offerManager.saveOffer(offer);

            createdOffer.title = updatedTitle;
            const offerId = createdOffer.offerPrices[0].id;
            createdOffer.offerPrices[0].description = updatedPriceDescription;
            const ruleId = createdOffer.offerPrices[0].rules[0].id;
            createdOffer.offerPrices[0].rules[0].rule = CompareAction.MORE_OR_EQUAL;


            const updated = await baseSeller.offerManager.saveOffer(createdOffer);

            updated.title.should.be.eql(updatedTitle);

            const updatedOffer = updated.offerPrices.find(e =>
                e.id === offerId
            );
            updatedOffer.description.should.be.eql(updatedPriceDescription);

            const updatedRule = updatedOffer.rules.find(e =>
                e.id === ruleId
            );
            updatedRule.rule.should.be.eql(CompareAction.MORE_OR_EQUAL);

        } catch (e) {
            console.log(e);
            throw e;
        }
    });
    it('should delete existed offer with multiprice', async () => {
        try {

            const offer = offerFactory(true);
            const createdOffer = await baseSeller.offerManager.saveOffer(offer);

            const id = createdOffer.id;
            const deleted = await baseSeller.offerManager.deleteOffer(id);
            const existedOffers = await baseSeller.offerManager.getMyOffers(id);

            existedOffers.length.should.be.eql(0);

        } catch (e) {
            console.log(e);
            throw e;
        }
    });
});
