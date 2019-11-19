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

describe('Offer Bulk update', async () => {
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

    it('should return proper id sequence of created/updated mixed offer list', async () => {
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

            createdOffer.forEach( (id, index) => {
                const sentId = bulk[index].id;
                if ( (sentId !== 0) && (sentId !== id) ) {
                    throw new Error('wrong sequence');
                }
            });
        } catch (e) {
            console.log(e);
            throw e;
        }
    });
    it('should update description and title', async () => {
        try {
            const bulkSize = 10;
            const bulk = [];

            for (let i = 0; i < bulkSize; i++) {
                const offer = offerFactory(true);
                const savedOffer = await baseSeller.offerManager.saveOffer(offer);
                const updated = savedOffer.copy ({
                    description: `test men's ${i}`,
                    title: `test ${i}`});
                bulk.push(updated);
            }
            console.log(bulk);

            const createdOffer = await baseSeller.offerManager.updateBulkOffers(bulk);

            createdOffer.length.should.be.eql(bulkSize);

            for (let i = 0; i < bulkSize; i++ ) {
                const id = createdOffer[i];
                const updatedOffer = (await baseSeller.offerManager.getMyOffers(id))[0];
                updatedOffer.title.should.be.eql(`test ${i}`);
                updatedOffer.description.should.be.eql(`test men's ${i}`);
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    });
    describe('offer price', async () => {
        it('should update when offer price description changed', async () => {
            try {
                const bulkSize = 10;
                const bulk = [];

                for (let i = 0; i < bulkSize; i++) {
                    const offer = offerFactory(true);
                    const savedOffer = await baseSeller.offerManager.saveOffer(offer);
                    savedOffer.offerPrices[0] = savedOffer.offerPrices[0].copy({description: `test ${i}`});
                    savedOffer.offerPrices[1] = savedOffer.offerPrices[1].copy({description: `test ${i}`});
                    savedOffer.offerPrices[2] = savedOffer.offerPrices[2].copy({description: `test ${i}`});
                    bulk.push(savedOffer);
                }
                console.log(bulk);

                const createdOffer = await baseSeller.offerManager.updateBulkOffers(bulk);

                createdOffer.length.should.be.eql(bulkSize);

                for (let i = 0; i < bulkSize; i++ ) {
                    const id = createdOffer[i];
                    const updatedOffer = (await baseSeller.offerManager.getMyOffers(id))[0];
                    updatedOffer.offerPrices[0].description.should.be.eql(`test ${i}`);
                    updatedOffer.offerPrices[1].description.should.be.eql(`test ${i}`);
                    updatedOffer.offerPrices[2].description.should.be.eql(`test ${i}`);
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        });
        it.skip('!!! should delete offer price', async () => {
            try {
                const bulkSize = 10;
                const bulk = [];

                for (let i = 0; i < bulkSize; i++) {
                    const offer = offerFactory(true);
                    const savedOffer = await baseSeller.offerManager.saveOffer(offer);
                    savedOffer.offerPrices = [savedOffer.offerPrices[0].copy({description: `test ${i}`})];
                    bulk.push(savedOffer);
                }
                console.log(bulk);

                const createdOffer = await baseSeller.offerManager.updateBulkOffers(bulk);

                createdOffer.length.should.be.eql(bulkSize);

                for (let i = 0; i < bulkSize; i++ ) {
                    const id = createdOffer[i];
                    const updatedOffer = (await baseSeller.offerManager.getMyOffers(id))[0];
                    updatedOffer.offerPrices[0].description.should.be.eql(`test ${i}`);
                    updatedOffer.offerPrices.length.should.be.eql(3);
                }

            } catch (e) {
                throw e;
            }
        });
    });
    describe('offer tags', async () => {
        it('should update when new tag was added', async () => {
            try {
                const bulkSize = 10;
                const bulk = [];

                for (let i = 0; i < bulkSize; i++) {
                    const offer = offerFactory(true);
                    const savedOffer = await baseSeller.offerManager.saveOffer(offer);
                    savedOffer.tags.set('test1', `test ${i}`);
                    bulk.push(savedOffer);
                }
                console.log(bulk);

                const createdOffer = await baseSeller.offerManager.updateBulkOffers(bulk);

                createdOffer.length.should.be.eql(bulkSize);

                for (let i = 0; i < bulkSize; i++ ) {
                    const id = createdOffer[i];
                    const updatedOffer = (await baseSeller.offerManager.getMyOffers(id))[0];
                    updatedOffer.tags.get('product').should.be.eql('car');
                    updatedOffer.tags.get('test1').should.be.eql(`test ${i}`);
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        });
        it('should update when existed tag value changed', async () => {
            try {
                const bulkSize = 10;
                const bulk = [];

                for (let i = 0; i < bulkSize; i++) {
                    const offer = offerFactory(true);
                    const savedOffer = await baseSeller.offerManager.saveOffer(offer);
                    savedOffer.tags.set('product', `test ${i}`);
                    bulk.push(savedOffer);
                }
                console.log(bulk);

                const createdOffer = await baseSeller.offerManager.updateBulkOffers(bulk);

                createdOffer.length.should.be.eql(bulkSize);

                for (let i = 0; i < bulkSize; i++ ) {
                    const id = createdOffer[i];
                    const updatedOffer = (await baseSeller.offerManager.getMyOffers(id))[0];
                    updatedOffer.tags.get('product').should.be.eql(`test ${i}`);
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        });
        it('should update and delete tags', async () => {
            try {
                const bulkSize = 10;
                const bulk = [];

                for (let i = 0; i < bulkSize; i++) {
                    const offer = offerFactory(true);
                    const savedOffer = await baseSeller.offerManager.saveOffer(offer);
                    savedOffer.tags.set('product', `test ${i}`);
                    savedOffer.tags.set('CREATED', 'new');
                    bulk.push(savedOffer);
                }
                console.log(bulk);

                const createdOffer = await baseSeller.offerManager.updateBulkOffers(bulk);

                createdOffer.length.should.be.eql(bulkSize);

                for (let i = 0; i < bulkSize; i++ ) {
                    const id = createdOffer[i];
                    const updatedOffer = (await baseSeller.offerManager.getMyOffers(id))[0];
                    updatedOffer.tags.get('product').should.be.eql(`test ${i}`);
                    updatedOffer.tags.get('CREATED').should.be.eql('new');
                    updatedOffer.tags.size.should.be.eql(2);
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        });
        it('should update when tag was deleted', async () => {
            try {
                const bulkSize = 10;
                const bulk = [];

                for (let i = 0; i < bulkSize; i++) {
                    const offer = offerFactory(true);
                    const savedOffer = await baseSeller.offerManager.saveOffer(offer);
                    savedOffer.tags.clear();
                    bulk.push(savedOffer);
                }
                console.log(bulk);

                const createdOffer = await baseSeller.offerManager.updateBulkOffers(bulk);

                createdOffer.length.should.be.eql(bulkSize);

                for (let i = 0; i < bulkSize; i++ ) {
                    const id = createdOffer[i];
                    const updatedOffer = (await baseSeller.offerManager.getMyOffers(id))[0];
                    updatedOffer.tags.size.should.be.eql(0);
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        });
    });
    describe('offer compare tag', async () => {
        it('should update when existed compare tag value changed', async () => {
            try {
                const bulkSize = 10;
                const bulk = [];

                for (let i = 0; i < bulkSize; i++) {
                    const offer = offerFactory(true);
                    const savedOffer = await baseSeller.offerManager.saveOffer(offer);
                    savedOffer.compare.set('age', `${i}`);
                    bulk.push(savedOffer);
                }
                console.log(bulk);

                const createdOffer = await baseSeller.offerManager.updateBulkOffers(bulk);

                createdOffer.length.should.be.eql(bulkSize);

                for (let i = 0; i < bulkSize; i++ ) {
                    const id = createdOffer[i];
                    const updatedOffer = (await baseSeller.offerManager.getMyOffers(id))[0];
                    updatedOffer.compare.get('age').should.be.eql(`${i}`);
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        });
        it('should delete', async () => {
            try {
                const bulkSize = 10;
                const bulk = [];

                for (let i = 0; i < bulkSize; i++) {
                    const offer = offerFactory(true);
                    const savedOffer = await baseSeller.offerManager.saveOffer(offer);
                    savedOffer.compare.clear();
                    bulk.push(savedOffer);
                }

                const createdOffer = await baseSeller.offerManager.updateBulkOffers(bulk);

                createdOffer.length.should.be.eql(bulkSize);

                for (let i = 0; i < bulkSize; i++ ) {
                    const id = createdOffer[i];
                    const updatedOffer = (await baseSeller.offerManager.getMyOffers(id))[0];
                    updatedOffer.compare.size.should.be.eql(0);
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        });
    });
    describe('offer rules', async () => {
        it('should update when existed offer rules changed', async () => {
            try {
                const bulkSize = 10;
                const bulk = [];

                for (let i = 0; i < bulkSize; i++) {
                    const offer = offerFactory(true);
                    const savedOffer = await baseSeller.offerManager.saveOffer(offer);
                    savedOffer.rules.set('age', CompareAction.EQUALLY);
                    bulk.push(savedOffer);
                }
                console.log(bulk);

                const createdOffer = await baseSeller.offerManager.updateBulkOffers(bulk);

                createdOffer.length.should.be.eql(bulkSize);

                for (let i = 0; i < bulkSize; i++ ) {
                    const id = createdOffer[i];
                    const updatedOffer = (await baseSeller.offerManager.getMyOffers(id))[0];
                    updatedOffer.rules.get('age').should.be.eql(CompareAction.EQUALLY);
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        });
        it('should delete rules', async () => {
            try {
                const bulkSize = 10;
                const bulk = [];

                for (let i = 0; i < bulkSize; i++) {
                    const offer = offerFactory(true);
                    const savedOffer = await baseSeller.offerManager.saveOffer(offer);
                    savedOffer.rules.clear();
                    bulk.push(savedOffer);
                }
                console.log(bulk);

                const createdOffer = await baseSeller.offerManager.updateBulkOffers(bulk);

                createdOffer.length.should.be.eql(bulkSize);

                for (let i = 0; i < bulkSize; i++ ) {
                    const id = createdOffer[i];
                    const updatedOffer = (await baseSeller.offerManager.getMyOffers(id))[0];
                    updatedOffer.rules.size.should.be.eql(0);
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        });
    });
    it.skip('speed test', async () => {
        try {
            const millenium = new Date('2000-01-01T00:00:00.859Z');
            for (let j = 0; j < 10; j++) {
                const bulk = [];
                for (let i = 0; i < 50; i++) {
                    const offer = offerFactory(true);
                    const oldOffer = offer.copy({ createdAt: millenium});
                    // offer.title = `${i}) ${offer.title}`;
                    bulk.push(oldOffer);
                }
                const start = new Date();
                const createdOfferIds = await baseSeller.offerManager.updateBulkOffers(bulk);
                const finish = new Date();
                const delta = finish.getTime() -  start.getTime();
                console.log(`create: ${delta}ms`);

                // updated
                const bulkForUpdate = bulk.map( (offer, index) => {
                    return offer.copy({id: createdOfferIds[index]});
                });
                const start1 = new Date();
                const updatedOfferIds = await baseSeller.offerManager.updateBulkOffers(bulkForUpdate);
                const finish1 = new Date();

                const delta1 = finish1.getTime() -  start1.getTime();
                console.log(`update: ${delta1}ms`);
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    });
});
