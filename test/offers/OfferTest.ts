// tslint:disable:no-unused-expression
import Base, { CompareAction, Offer } from '../../src/Base';
import Account from '../../src/repository/models/Account';
import { OfferPrice } from '../../src/repository/models/OfferPrice';
import { OfferPriceRules } from '../../src/repository/models/OfferPriceRules';
import { RepositoryStrategyType } from '../../src/repository/RepositoryStrategyType';
import { RpcTransport } from '../../src/repository/source/rpc/RpcTransport';
import { TransportFactory } from '../../src/repository/source/TransportFactory';
import AuthenticatorHelper from '../AuthenticatorHelper';

require('chai').use(require('chai-as-promised')).should();
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

describe('Offer CRUD', async () => {
    const passPhraseSeller: string = 'Seller';
    const passPhraseBusinessBuyer: string = 'Business';  // need 5 symbols

    const baseSeller: Base = createBase();
    const baseBusinessBuyer: Base = createBase();

    function createBase(): Base {
        return new Base(
            baseNodeUrl,
            'localhost',
            RepositoryStrategyType.Postgres,
            rpcSignerHost
        );
    }

    function offerFactory(isMultiPrices: boolean = false): Offer {
        const offerTags = new Map<string, string>([['product', 'car']]);
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
        await createUser(baseSeller, passPhraseSeller);
        await createUser(baseBusinessBuyer, passPhraseBusinessBuyer);
    });

    after(async () => {
        // rpcClient.disconnect();
    });

    it('should create simple offer', async () => {
        try {
            const offer = offerFactory();
            const createdOffer = await baseSeller.offerManager.saveOffer(offer);
            // noinspection BadExpressionStatementJS
            createdOffer.id.should.exist;
        } catch (e) {
            console.log(e);
            throw e;
        }
    });
    it('should bulk update of simple offers', async () => {
        try {
            const bulkSize = 10;
            const bulk = [];

            for (let i = 0; i < bulkSize; i++) {

                let offer = offerFactory();
                bulk.push(offer);

                offer = offerFactory();
                const savedOffer = await baseSeller.offerManager.saveOffer(offer);
                bulk.push(savedOffer);
            }
            const createdOffer = await baseSeller.offerManager.updateBulkOffers(bulk);

            createdOffer.length.should.be.eql(bulkSize * 2);
        } catch (e) {
            console.log(e);
            throw e;
        }
    });
    it('should bulk update offers with multiprice', async () => {
        try {
            const bulkSize = 10;
            const bulk = [];

            for (let i = 0; i < bulkSize; i++) {

                let offer = offerFactory(true);
                bulk.push(offer);

                offer = offerFactory(true);
                const savedOffer = await baseSeller.offerManager.saveOffer(offer);
                bulk.push(savedOffer);
            }
            const createdOffer = await baseSeller.offerManager.updateBulkOffers(bulk);

            createdOffer.length.should.be.eql(bulkSize * 2);
        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it('should bulk update offers with multiprice', async () => {
        try {
            const bulkSize = 10;
            const bulk = [];

            for (let i = 0; i < bulkSize; i++) {
                const offer = offerFactory(true);
                bulk.push(offer);
            }
            const createdOffer = await baseSeller.offerManager.updateBulkOffers(bulk);

            createdOffer.length.should.be.eql(bulkSize);

            for (let i = 0; i < bulkSize; i++) {
                const offers = await baseSeller.offerManager.getMyOffers(createdOffer[i]);
                const one = offers[0];
                one.offerPrices.length.should.be.eql(bulk[i].offerPrices.length);
                for (let j = 0; j < one.offerPrices.length; j++) {
                    one.offerPrices[j].rules.length.should.be.eql(bulk[i].offerPrices[j].rules.length);
                }
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it('should bulk update offers check by fields', async () => {
        try {
            const bulk = [];

            const offer1 = offerFactory();
            offer1.title = '1 new simple';
            bulk.push(offer1);

            const offer2 = offerFactory(true);
            offer2.title = '2 new with price';
            bulk.push(offer2);

            const offer3 = offerFactory();
            offer3.title = '3 saved simple';
            const savedOffer1 = await baseSeller.offerManager.saveOffer(offer3);
            savedOffer1.title = '3 updated simple';
            bulk.push(savedOffer1);

            const offer4 = offerFactory(true);
            offer4.title = '4 saved with price';
            const savedOffer2 = await baseSeller.offerManager.saveOffer(offer4);
            savedOffer2.title = '4 updated with price';
            bulk.push( savedOffer2);

            const bulkUpdatedOffer = await baseSeller.offerManager.updateBulkOffers(bulk);

            bulkUpdatedOffer.length.should.be.eql(bulk.length);
            const one = (await baseSeller.offerManager.getMyOffers(bulkUpdatedOffer[0]))[0];
            const two = (await baseSeller.offerManager.getMyOffers(bulkUpdatedOffer[1]))[0];
            const three = (await baseSeller.offerManager.getMyOffers(bulkUpdatedOffer[2]))[0];
            const four = (await baseSeller.offerManager.getMyOffers(bulkUpdatedOffer[3]))[0];

            one.title.should.be.eql('1 new simple');
            two.title.should.be.eql('2 new with price');
            three.title.should.be.eql('3 updated simple');
            four.title.should.be.eql('4 updated with price');

            two.offerPrices.length.should.be.eql(offer2.offerPrices.length);
            four.offerPrices.length.should.be.eql(offer4.offerPrices.length);

        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it.only('speed test', async () => {
        try {
            const bulk = [];
            for (let i = 0; i < 50; i++) {
                const offer = offerFactory(true);
                bulk.push(offer);
            }
            const start = new Date();
            await baseSeller.offerManager.updateBulkOffers(bulk);
            const finish = new Date();
            const delta = finish.getTime() -  start.getTime();
            console.log(`${delta}ms`);
        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    // it('should bulk update handle error: create new Offer', async () => {
    //     try {
    //         const bulk = [];

    //         const offer3 = offerFactory();
    //         offer3.title = '1 saved simple';
    //         const savedOffer1 = await baseSeller.offerManager.saveOffer(offer3);
    //         savedOffer1.title = '1 updated simple';
    //         bulk.push(savedOffer1);

    //         const offer4 = offerFactory(true);
    //         offer4.title = '2 saved with price';
    //         const savedOffer2 = await baseSeller.offerManager.saveOffer(offer4);
    //         savedOffer2.title = '2 updated with price';
    //         bulk.push( savedOffer2);

    //         await baseSeller.offerManager.deleteOffer(savedOffer2.id);

    //         await baseSeller.offerManager.updateBulkOffers(bulk);

    //         const one = (await baseSeller.offerManager.getMyOffers(offer3.id))[0];
    //         const two = (await baseSeller.offerManager.getMyOffers(offer4.id))[0];

    //         one.title.should.be.eql(savedOffer1.title);
    //         two.title.should.be.eql(savedOffer2.title);

    //     } catch (e) {
    //         console.log(e);
    //         throw e;
    //     }
    // });

    it('should create offer with multiprice', async () => {
        try {
            const offer = offerFactory(true);
            const createdOffer = await baseSeller.offerManager.saveOffer(offer);
            // noinspection BadExpressionStatementJS
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

            const copied = createdOffer.copy();

            copied.offerPrices[0] = copied.offerPrices[0].copy({description: updatedPriceDescription});
            copied.offerPrices[0].rules[0] = createdOffer.offerPrices[0]
                .rules[0]
                .copy({rule: CompareAction.MORE_OR_EQUAL});

            const ruleId = copied.offerPrices[0].rules[0].id;

            const updated = await baseSeller.offerManager.saveOffer(copied);

            updated.title.should.be.eql(updatedTitle);

            const updatedOffer = updated.offerPrices.find(e => e.id === offerId) as OfferPrice;

            updatedOffer.description.should.be.eql(updatedPriceDescription);

            const updatedRule = updatedOffer.rules.find(e => e.id === ruleId) as OfferPriceRules;

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
            await baseSeller.offerManager.deleteOffer(id);
            const existedOffers = await baseSeller.offerManager.getMyOffers(id);

            existedOffers.length.should.be.eql(0);

        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it('should get existed offer with tag', async () => {
        try {
            const offer = offerFactory();
            await baseSeller.offerManager.saveOffer(offer);

            const existedOffers = await baseSeller.offerManager.getMyOffersByTag('product');

            existedOffers.length.should.be.eql(1);

        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it('should return page with offers', async () => {
        try {
            const existedOffers = await baseSeller.offerManager.getOffersByPage();

            const expected = Math.min(20, existedOffers.total);
            existedOffers.content.length.should.be.eql(expected);
        } catch (e) {
            console.log(e);
            throw e;
        }
    });
});
