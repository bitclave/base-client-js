import { OfferRank } from '../../repository/models/OfferRank';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { ArrayDeserializer } from '../../utils/types/json-transform/deserializers/ArrayDeserializer';
import { OfferRankManager } from '../OfferRankManager';

export class RemoteOfferRankManagerImpl implements OfferRankManager {

    constructor(private readonly transport: RpcTransport) {
    }

    public create(rank: number, rankerId: string, offerId: number): Promise<OfferRank> {
        return this.transport.request('offerRankManager.create', [rank, rankerId, offerId], OfferRank);
    }

    public delete(offerRankId: number): Promise<number> {
        return this.transport.request('offerRankManager.delete', [offerRankId]);
    }

    public getById(offerRankId: number): Promise<OfferRank> {
        return this.transport.request('offerRankManager.getById', [offerRankId], OfferRank);
    }

    public getByOfferId(offerId: number): Promise<Array<OfferRank>> {
        return this.transport.request('offerRankManager.getByOfferId', [offerId], new ArrayDeserializer(OfferRank));
    }

    public getByOfferIdAndRankId(offerId: number, rankerId: string): Promise<OfferRank> {
        return this.transport.request('offerRankManager.getByOfferIdAndRankId', [offerId, rankerId], OfferRank);
    }

    public update(offerRank: OfferRank): Promise<OfferRank> {
        return this.transport.request('offerRankManager.update', [offerRank.toJson()], OfferRank);
    }
}
