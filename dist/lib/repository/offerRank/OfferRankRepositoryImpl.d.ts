import { HttpTransport } from '../source/http/HttpTransport';
import { OfferRank } from '../models/OfferRank';
import { OfferRankRepository } from './OfferRankRepository';
export declare class OfferRankRepositoryImpl implements OfferRankRepository {
    private readonly OFFER_RANK_API;
    private transport;
    constructor(transport: HttpTransport);
    getByOfferIdAndRankId(offerId: number, rankerId: string): Promise<OfferRank>;
    getByOfferId(offerId: number): Promise<Array<OfferRank>>;
    getById(offerRankId: number): Promise<OfferRank>;
    save(rank: OfferRank): Promise<OfferRank>;
    update(rank: OfferRank): Promise<OfferRank>;
    delete(offerRankId: number): Promise<number>;
    private jsonToListOfferRanks;
}
