import { OfferRank } from '../repository/models/OfferRank';

export interface OfferRankManager {

    getByOfferIdAndRankId(offerId: number, rankerId: number): Promise<OfferRank>;

    getByOfferId(offerId: number): Promise<Array<OfferRank>>;

    getById(offerRankId: number): Promise<OfferRank>;

    create(rank: number, rankerId: number, offerId: number): Promise<OfferRank>;

    update(offerRank: OfferRank): Promise<OfferRank>;

    delete(offerRankId: number): Promise<number>;
}
