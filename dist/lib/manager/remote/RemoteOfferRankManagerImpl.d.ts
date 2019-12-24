import { OfferRank } from '../../repository/models/OfferRank';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { OfferRankManager } from '../OfferRankManager';
export declare class RemoteOfferRankManagerImpl implements OfferRankManager {
    private readonly transport;
    constructor(transport: RpcTransport);
    create(rank: number, rankerId: string, offerId: number): Promise<OfferRank>;
    delete(offerRankId: number): Promise<number>;
    getById(offerRankId: number): Promise<OfferRank>;
    getByOfferId(offerId: number): Promise<Array<OfferRank>>;
    getByOfferIdAndRankId(offerId: number, rankerId: string): Promise<OfferRank>;
    update(offerRank: OfferRank): Promise<OfferRank>;
}
