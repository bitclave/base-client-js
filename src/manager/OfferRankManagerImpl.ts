import { OfferRank } from '../repository/models/OfferRank';
import { OfferRankRepository } from '../repository/offerRank/OfferRankRepository';
import { ExportMethod } from '../utils/ExportMethod';
import { ParamDeserializer } from '../utils/types/json-transform';
import { OfferRankManager } from './OfferRankManager';

export class OfferRankManagerImpl implements OfferRankManager {

    constructor(private readonly offerRankRepository: OfferRankRepository) {}

    @ExportMethod()
    public getByOfferIdAndRankId(offerId: number, rankerId: string): Promise<OfferRank> {
        return this.offerRankRepository.getByOfferIdAndRankId(offerId, rankerId);
    }

    @ExportMethod()
    public getByOfferId(offerId: number): Promise<Array<OfferRank>> {
        return this.offerRankRepository.getByOfferId(offerId);
    }

    @ExportMethod()
    public getById(offerRankId: number): Promise<OfferRank> {
        return this.offerRankRepository.getById(offerRankId);
    }

    @ExportMethod()
    public create(rank: number, rankerId: string, offerId: number): Promise<OfferRank> {
        const offerRank = new OfferRank(rank, offerId, rankerId);
        return this.offerRankRepository.save(offerRank);
    }

    @ExportMethod()
    public update(@ParamDeserializer(OfferRank) offerRank: OfferRank): Promise<OfferRank> {
        return this.offerRankRepository.update(offerRank);
    }

    @ExportMethod()
    public delete(offerRankId: number): Promise<number> {
        return this.offerRankRepository.delete(offerRankId);
    }
}
