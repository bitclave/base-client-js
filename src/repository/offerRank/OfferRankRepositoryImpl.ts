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
        const response = await this.transport.sendRequest<OfferRank>(
            this.OFFER_RANK_API,
            HttpMethod.Get,
            { offerId, rankerId }
        );
        return OfferRank.fromJson(response.json);
    }

    public async getByOfferId(offerId: number): Promise<Array<OfferRank>> {
        const url = `${this.OFFER_RANK_API}/${offerId}`;
        const response = await this.transport.sendRequest<Array<OfferRank>>(url, HttpMethod.Get);
        return this.jsonToListOfferRanks(response.json);
    }

    public async getById(offerRankId: number): Promise<OfferRank> {
        const response = await this.transport.sendRequest<OfferRank>(
            this.OFFER_RANK_API,
            HttpMethod.Get,
            { offerRankId }
        );
        return OfferRank.fromJson(response.json);
    }

    public async save(rank: OfferRank): Promise<OfferRank> {
        const response = await this.transport.sendRequest<OfferRank>(
            this.OFFER_RANK_API,
            HttpMethod.Post,
            rank
        );
        return OfferRank.fromJson(response && response.json);
    }

    public async update(rank: OfferRank): Promise<OfferRank> {
        const response = await this.transport.sendRequest<OfferRank>(
            this.OFFER_RANK_API,
            HttpMethod.Put,
            rank
        );
        return OfferRank.fromJson(response && response.json);
    }

    public async delete(offerRankId: number): Promise<number> {
        const response = await this.transport.sendRequest<string>(
            this.OFFER_RANK_API,
            HttpMethod.Delete,
            { offerRankId }
        );
        return parseInt(response.toString(), 10);
    }

    private jsonToListOfferRanks(json: JsonObject<Array<OfferRank>>): Array<OfferRank> {
        return Object.keys(json).map(key => OfferRank.fromJson(json[key] as object));
    }

}
