import { OfferRank } from '../../repository/models/OfferRank';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { ArrayDeserializer } from '../../utils/types/json-transform/deserializers/ArrayDeserializer';
import { OfferRankManager } from '../OfferRankManager';

export class RemoteOfferRankManagerImpl implements OfferRankManager {

    constructor(private readonly transport: RpcTransport) {
    }

    public create(rank: number, rankerId: string, offerId: number): Promise<OfferRank> {
        return this.transport.request('create', [rank, rankerId, offerId], OfferRank);
    }

    public delete(offerRankId: number): Promise<number> {
        return this.transport.request('delete', [offerRankId]);
    }

    public getById(offerRankId: number): Promise<OfferRank> {
        return this.transport.request('getById', [offerRankId], OfferRank);
    }

    public getByOfferId(offerId: number): Promise<Array<OfferRank>> {
        return this.transport.request('getByOfferId', [offerId], new ArrayDeserializer(OfferRank));
    }

    public getByOfferIdAndRankId(offerId: number, rankerId: string): Promise<OfferRank> {
        return this.transport.request('getByOfferIdAndRankId', [offerId, rankerId], OfferRank);
    }

    public update(offerRank: OfferRank): Promise<OfferRank> {
        return this.transport.request('update', [offerRank.toJson()], OfferRank);
    }
}
