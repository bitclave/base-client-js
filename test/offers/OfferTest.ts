// tslint:disable:no-unused-expression
import Base, { CompareAction, JsonObject, Offer } from '../../src/Base';
import { OfferPrice } from '../../src/repository/models/OfferPrice';
import { OfferPriceRules } from '../../src/repository/models/OfferPriceRules';
import { BaseClientHelper } from '../BaseClientHelper';

require('chai').use(require('chai-as-promised')).should();

describe('Offer CRUD', async () => {
    const passPhraseSeller: string = 'Seller';

    let baseSeller: Base;

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
        baseSeller = await BaseClientHelper.createRegistered(passPhraseSeller);
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

            copied.offerPrices[0] = copied.offerPrices[0]
                .copy({description: updatedPriceDescription} as JsonObject<OfferPrice>);
            copied.offerPrices[0].rules[0] = createdOffer.offerPrices[0]
                .rules[0]
                .copy({rule: CompareAction.MORE_OR_EQUAL} as JsonObject<OfferPriceRules>);

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
