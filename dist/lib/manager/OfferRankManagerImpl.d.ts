import { OfferRank } from '../repository/models/OfferRank';
import { OfferRankRepository } from '../repository/offerRank/OfferRankRepository';
import { OfferRankManager } from './OfferRankManager';
export declare class OfferRankManagerImpl implements OfferRankManager {
    private offerRankRepository;
    constructor(offerRankRepository: OfferRankRepository);
    getByOfferIdAndRankId(offerId: number, rankerId: string): Promise<OfferRank>;
    getByOfferId(offerId: number): Promise<Array<OfferRank>>;
    getById(offerRankId: number): Promise<OfferRank>;
    create(rank: number, rankerId: string, offerId: number): Promise<OfferRank>;
    update(offerRank: OfferRank): Promise<OfferRank>;
    delete(offerRankId: number): Promise<number>;
}
