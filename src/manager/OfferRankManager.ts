import { OfferRank } from './../repository/models/OfferRank';

export interface OfferRankManager {

    getByOfferIdAndRankId(offerId: number, rankerId: string): Promise<OfferRank>;
    getByOfferId(offerId: number): Promise<Array<OfferRank>>;
    getById(offerRankId: number): Promise<OfferRank>;

    create(rank: number, rankerId: string, offerId: number): Promise<OfferRank>;
    update(offerRank: OfferRank): Promise<OfferRank>;

    delete(offerRankId: number): Promise<number>;
}
