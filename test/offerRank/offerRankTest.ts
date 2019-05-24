// tslint:disable:no-unused-expression
import Base, { CompareAction, Offer, OfferRank } from '../../src/Base';
import Account from '../../src/repository/models/Account';

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
        // ignore
    }

    return await user.accountManager.registration(pass, someSigMessage); // this method private.
}
function randomOfferId() {
    return (new Date()).getTime();
}

describe('OfferRank', async () => {
    const base = new Base(
        baseNodeUrl,
        'localhost',
        RepositoryStrategyType.Postgres,
        rpcSignerHost
    );
    it('should create simple offer', async () => {
        const user = await createUser(base, 'OfferRankPassTest');
        const rank = 11;
        const baseOfferId = randomOfferId();
        const RANKER = user.publicKey;
        const offerRank = await base.offerRankManager.create(rank, RANKER, baseOfferId);
        offerRank.should.exist;
    });
    it('should create new OfferRank via update', async () => {
        const user = await createUser(base, 'OfferRankPassTest');
        const rank = 112;
        const offerId = randomOfferId();
        const rankerId = user.publicKey;
        const offerRank = new OfferRank({rank, offerId, rankerId});
        const created = await base.offerRankManager.update(offerRank);
        created.id.should.exist;
    });
    it('should update created OfferRank via update', async () => {
        const user = await createUser(base, 'OfferRankPassTest');
        const offerId = randomOfferId();
        const rankerId = user.publicKey;

        const offerRank = await base.offerRankManager.create(11, rankerId, offerId);
        const id = offerRank.id;
        const createdAt = offerRank.createdAt;
        const updatedAt = offerRank.updatedAt;

        const rank = 112;
        const forUpdating = new OfferRank({id, rank, offerId, rankerId, createdAt, updatedAt});

        const updated = await base.offerRankManager.update(forUpdating);
        updated.id.should.be.eql(id);
        updated.rank.should.be.eql(112);
        updated.createdAt.should.be.eql(createdAt);
        updated.updatedAt.should.not.be.eql(updatedAt);
    });
    it('should get OfferRanks by offerId', async () => {
        const user1 = await createUser(base, 'OfferRankPassTest');
        const user2 = await createUser(base, 'OfferRankPassTest');
        const user3 = await createUser(base, 'OfferRankPassTest');

        const offerId = randomOfferId();

        await base.offerRankManager.create(11, user1.publicKey, offerId);
        await base.offerRankManager.create(22, user2.publicKey, offerId);
        await base.offerRankManager.create(33, user3.publicKey, offerId);

        const offerRanks = await base.offerRankManager.getByOfferId(offerId);
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
        const user = await createUser(base, 'OfferRankPassTest');
        const rankerId = user.publicKey;
        const offerId = randomOfferId();

        await base.offerRankManager.create(11, rankerId, offerId);
        await base.offerRankManager.create(22, rankerId, offerId);

        const offerRanks = await base.offerRankManager.getByOfferId(offerId);
        offerRanks.length.should.be.eql(1);
        offerRanks[0].rank.should.be.eql(22);
    });
});
