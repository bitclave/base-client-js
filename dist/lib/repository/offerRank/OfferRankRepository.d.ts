import { OfferRank } from './../models/OfferRank';
export interface OfferRankRepository {
    getByOfferIdAndRankId(offerId: number, rankerId: string): Promise<OfferRank>;
    getByOfferId(offerId: number): Promise<Array<OfferRank>>;
    getById(offerRankId: number): Promise<OfferRank>;
    save(rank: OfferRank): Promise<OfferRank>;
    update(rank: OfferRank): Promise<OfferRank>;
    delete(offerRankId: number): Promise<number>;
}
