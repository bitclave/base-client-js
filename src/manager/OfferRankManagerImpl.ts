import { OfferRank } from '../repository/models/OfferRank';
import { OfferRankRepository } from '../repository/offerRank/OfferRankRepository';
import { OfferRankManager } from './OfferRankManager';

export class OfferRankManagerImpl implements OfferRankManager {

    constructor(private readonly offerRankRepository: OfferRankRepository) {
    }

    public getByOfferIdAndRankId(offerId: number, rankerId: number): Promise<OfferRank> {
        return this.offerRankRepository.getByOfferIdAndRankId(offerId, rankerId);
    }

    public getByOfferId(offerId: number): Promise<Array<OfferRank>> {
        return this.offerRankRepository.getByOfferId(offerId);
    }

    public getById(offerRankId: number): Promise<OfferRank> {
        return this.offerRankRepository.getById(offerRankId);
    }

    public create(rank: number, rankerId: number, offerId: number): Promise<OfferRank> {
        const offerRank = new OfferRank(rank, offerId, rankerId);

        return this.offerRankRepository.save(offerRank);
    }

    public update(offerRank: OfferRank): Promise<OfferRank> {
        return this.offerRankRepository.update(offerRank);
    }

    public delete(offerRankId: number): Promise<number> {
        return this.offerRankRepository.delete(offerRankId);
    }
}
