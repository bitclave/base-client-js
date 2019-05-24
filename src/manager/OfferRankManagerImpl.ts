import { OfferRank } from '../repository/models/OfferRank';
import { OfferRankManager } from './OfferRankManager';

import { OfferRankRepository } from '../repository/offerRank/OfferRankRepository';

export class OfferRankManagerImpl implements OfferRankManager {

    private offerRankRepository: OfferRankRepository;

    constructor(repository: OfferRankRepository) {
        this.offerRankRepository = repository;
    }
    public async getByOfferIdAndRankId(offerId: number, rankerId: string): Promise<OfferRank> {
        return this.offerRankRepository.getByOfferIdAndRankId(offerId, rankerId);
    }
    public async getByOfferId(offerId: number): Promise<Array<OfferRank>> {
        return this.offerRankRepository.getByOfferId(offerId);
    }
    public async getById(offerRankId: number): Promise<OfferRank> {
        return this.offerRankRepository.getById(offerRankId);
    }
    public async create(rank: number, rankerId: string, offerId: number): Promise<OfferRank> {
        const offerRank = new OfferRank({rank, rankerId, offerId});
        return this.offerRankRepository.save(offerRank);
    }
    public async update(offerRank: OfferRank): Promise<OfferRank> {
        return this.offerRankRepository.update(offerRank);
    }
    public async delete(offerRankId: number): Promise<number> {
        return this.offerRankRepository.delete(offerRankId);
    }
}
