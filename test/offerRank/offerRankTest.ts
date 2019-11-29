// tslint:disable:no-unused-expression
import { JsonObject, OfferRank } from '../../src/Base';
import { BaseClientHelper } from '../BaseClientHelper';

require('chai').use(require('chai-as-promised')).should();

function randomOfferId() {
    return (new Date()).getTime();
}

describe('OfferRank', async () => {

    it('should create simple offer', async () => {
        const base = await BaseClientHelper.createRegistered('OfferRankPassTest');
        const account = base.accountManager.getAccount();

        const rank = 11;
        const baseOfferId = randomOfferId();
        const RANKER = account.publicKey;
        const offerRank = await base.offerRankManager.create(rank, RANKER, baseOfferId);

        offerRank.should.exist;
    });

    it('should create new OfferRank via update', async () => {
        const base = await BaseClientHelper.createRegistered('OfferRankPassTest');
        const account = base.accountManager.getAccount();

        const rank = 112;
        const offerId = randomOfferId();
        const rankerId = account.publicKey;
        const offerRank = new OfferRank(rank, offerId, rankerId);
        const created = await base.offerRankManager.update(offerRank);

        created.id.should.exist;
    });

    it('should update created OfferRank via update', async () => {
        const base = await BaseClientHelper.createRegistered('OfferRankPassTest');
        const account = base.accountManager.getAccount();

        const offerId = randomOfferId();
        const rankerId = account.publicKey;

        const offerRank = await base.offerRankManager.create(11, rankerId, offerId);
        const id = offerRank.id;
        const createdAt = offerRank.createdAt;
        const updatedAt = offerRank.updatedAt;

        const rank = 112;
        const forUpdating = offerRank.copy({rank} as JsonObject<OfferRank>);

        const updated = await base.offerRankManager.update(forUpdating);

        updated.id.should.be.eql(id);
        updated.rank.should.be.eql(112);
        updated.createdAt.should.be.eql(createdAt);
        updated.updatedAt.should.not.be.eql(updatedAt);
    });

    it('should get OfferRanks by offerId', async () => {
        const base1 = await BaseClientHelper.createRegistered('OfferRankPassTest1');
        const base2 = await BaseClientHelper.createRegistered('OfferRankPassTest2');
        const base3 = await BaseClientHelper.createRegistered('OfferRankPassTest3');

        const account1 = base1.accountManager.getAccount();
        const account2 = base2.accountManager.getAccount();
        const account3 = base3.accountManager.getAccount();

        const offerId = randomOfferId();

        await base1.offerRankManager.create(11, account1.publicKey, offerId);
        await base2.offerRankManager.create(22, account2.publicKey, offerId);
        await base3.offerRankManager.create(33, account3.publicKey, offerId);

        const offerRanks = await base1.offerRankManager.getByOfferId(offerId);

        offerRanks.length.should.be.eql(3);
    });

    /*
    it('should not allow change OfferRank offerId', async () => {
        try {
            const user = await createUser(base, 'OfferRankPassTest');
            const rankerId = user.publicKey;
            const offerId = randomOfferId();

            const created = await base.offerRankManager.create(11, rankerId, offerId);
            created.offerId = 22;
            const updated = await base.offerRankManager.update(created);
            updated.should.be.an('object');
            throw new Error('it an not happen becase we are expecting error');
        } catch (e) {
            console.log(e);
        }
    });

    it('should not allow change RankId offerId', async () => {
        try {
            const user = await createUser(base, 'OfferRankPassTest');
            const user2 = await createUser(base, 'OfferRankPassTest');
            const offerId = randomOfferId();

            const created = await base.offerRankManager.create(11, user.publicKey, offerId);
            created.rankerId = user2.publicKey;
            const updated = await base.offerRankManager.update(created);
            updated.should.be.an('object');
            throw new Error('it an not happen becase we are expecting error');
        } catch (e) {
            console.log(e);
        }
    });
    */

    it('should update OfferRanks if exist OfferRank with the same OfferIf and RankerId', async () => {
        const base = await BaseClientHelper.createRegistered('OfferRankPassTest');
        const account = base.accountManager.getAccount();

        const rankerId = account.publicKey;
        const offerId = randomOfferId();

        await base.offerRankManager.create(11, rankerId, offerId);
        await base.offerRankManager.create(22, rankerId, offerId);

        const offerRanks = await base.offerRankManager.getByOfferId(offerId);

        offerRanks.length.should.be.eql(1);
        offerRanks[0].rank.should.be.eql(22);
    });
});
