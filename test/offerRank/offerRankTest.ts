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
        // console.log('check createUser', e);
        // ignore error if user not exist
    }

    return await user.accountManager.registration(pass, someSigMessage); // this method private.
}

describe('OfferRank', async () => {
    const base = new Base(
        baseNodeUrl,
        'localhost',
        RepositoryStrategyType.Postgres,
        rpcSignerHost
    );
    it('should create simple offer', async () => {
        try {
            await createUser(base, 'OfferRankPassTest');
            const rank = 11;
            const baseOfferId = 123456;
            const RANKER = 1;
            const offerRank = await base.offerRankManager.create(rank, RANKER, baseOfferId);
            offerRank.should.exist;
        } catch (e) {
            console.log(e);
            throw e;
        }
    });
    it('should create new OfferRank via update', async () => {
        try {
            await createUser(base, 'OfferRankPassTest');
            const rank = 112;
            const offerId = 12345678;
            const rankerId = 1;
            const offerRank = new OfferRank({rank, offerId, rankerId});
            const created = await base.offerRankManager.update(offerRank);
            created.id.should.exist;
        } catch (e) {
            console.log(e);
            throw e;
        }
    });
    it('should update created OfferRank via update', async () => {
        try {
            await createUser(base, 'OfferRankPassTest');
            const offerRank = await base.offerRankManager.create(11, 1, 123456);
            const id = offerRank.id;
            const createdAt = offerRank.createdAt;
            const updatedAt = offerRank.updatedAt;

            const rank = 112;
            const offerId = 12345678;
            const rankerId = 1;
            const forUpdating = new OfferRank({id, rank, offerId, rankerId, createdAt, updatedAt});

            const updated = await base.offerRankManager.update(forUpdating);
            updated.id.should.be.eql(id);
            updated.createdAt.should.be.eql(createdAt);
            updated.updatedAt.should.not.be.eql(updatedAt);

        } catch (e) {
            console.log(e);
            throw e;
        }
    });
    it.only('should get created OfferRanks by offerId', async () => {
        try {
            await createUser(base, 'OfferRankPassTest');
            const offerId = (new Date()).getTime();

            await base.offerRankManager.create(11, 1, offerId);
            await base.offerRankManager.create(22, 2, offerId);
            await base.offerRankManager.create(33, 3, offerId);

            const offerRanks = await base.offerRankManager.getByOfferId(offerId);
            offerRanks.length.should.be.eql(3);


        } catch (e) {
            console.log(e);
            throw e;
        }
    });
});
