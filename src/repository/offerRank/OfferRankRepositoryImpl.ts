import { HttpMethod } from '../source/http/HttpMethod';
import { HttpTransport } from '../source/http/HttpTransport';

import { OfferRank } from '../models/OfferRank';
import { OfferRankRepository } from './OfferRankRepository';

export class OfferRankRepositoryImpl implements OfferRankRepository {
    private readonly OFFER_RANK_API = '/v1/offerRank';
    private transport: HttpTransport;
    constructor(transport: HttpTransport) {
        this.transport = transport;
    }
    public async getByOfferIdAndRankId(offerId: number, rankerId: number): Promise<OfferRank> {
        return this.transport.sendRequest<OfferRank>(
            this.OFFER_RANK_API,
            HttpMethod.Get,
            {offerId, rankerId}
        ).then( response => new OfferRank(response));
    }
    public async getByOfferId(offerId: number): Promise<Array<OfferRank>> {
        throw new Error('Method not implemented.');
    }
    public async getById(offerRankId: number): Promise<OfferRank> {
        return this.transport.sendRequest<OfferRank>(
            this.OFFER_RANK_API,
            HttpMethod.Get,
            {offerRankId}
        ).then( response => new OfferRank(response));
    }
    public async save(rank: OfferRank): Promise<OfferRank> {
        return this.transport.sendRequest<OfferRank>(
            this.OFFER_RANK_API,
            HttpMethod.Put,
            rank
        ).then( response => new OfferRank(response));
    }
    public async delete(offerRankId: number): Promise<number> {
        return this.transport.sendRequest<string>(
            this.OFFER_RANK_API,
            HttpMethod.Delete,
            {offerRankId}
        ).then( response => parseInt(response.toString(), 10));
    }

}
