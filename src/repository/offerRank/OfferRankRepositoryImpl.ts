import { HttpMethod } from '../source/http/HttpMethod';
import { HttpTransport } from '../source/http/HttpTransport';

import { OfferRank } from '../models/OfferRank';
import { JsonObject } from './../models/JsonObject';
import { OfferRankRepository } from './OfferRankRepository';

export class OfferRankRepositoryImpl implements OfferRankRepository {
    private readonly OFFER_RANK_API = '/v1/offerRank';
    private transport: HttpTransport;
    constructor(transport: HttpTransport) {
        this.transport = transport;
    }
    public async getByOfferIdAndRankId(offerId: number, rankerId: string): Promise<OfferRank> {
        return this.transport.sendRequest<OfferRank>(
            this.OFFER_RANK_API,
            HttpMethod.Get,
            {offerId, rankerId}
        ).then( response => new OfferRank(response));
    }
    public async getByOfferId(offerId: number): Promise<Array<OfferRank>> {
        const url = `${this.OFFER_RANK_API}/${offerId}`;
        return this.transport.sendRequest<Array<OfferRank>>(
            url,
            HttpMethod.Get
        ).then( response => {
            return this.jsonToListOfferRanks(response.json);
        });
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
            HttpMethod.Post,
            rank
        ).then( response =>
            new OfferRank(response && response.json)
        );
    }
    public async update(rank: OfferRank): Promise<OfferRank> {
        return this.transport.sendRequest<OfferRank>(
            this.OFFER_RANK_API,
            HttpMethod.Put,
            rank
        ).then( response =>
            new OfferRank(response && response.json)
        );
    }
    public async delete(offerRankId: number): Promise<number> {
        return this.transport.sendRequest<string>(
            this.OFFER_RANK_API,
            HttpMethod.Delete,
            {offerRankId}
        ).then( response => parseInt(response.toString(), 10));
    }
    private jsonToListOfferRanks(json: JsonObject<Array<OfferRank>>): Array<OfferRank> {
        return Object.keys(json).map(key => new OfferRank(json[key] as object));
    }

}
