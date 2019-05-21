import { JsonObject } from '../models/JsonObject';
import { OfferRank } from '../models/OfferRank';
import { HttpMethod } from '../source/http/HttpMethod';
import { HttpTransport } from '../source/http/HttpTransport';
import { OfferRankRepository } from './OfferRankRepository';

export class OfferRankRepositoryImpl implements OfferRankRepository {
    private readonly OFFER_RANK_API = '/v1/offerRank';

    constructor(private readonly transport: HttpTransport) {
    }

    public getByOfferIdAndRankId(offerId: number, rankerId: number): Promise<OfferRank> {
        return this.transport.sendRequest<OfferRank>(
            this.OFFER_RANK_API,
            HttpMethod.Get,
            {offerId, rankerId}
        ).then(response => OfferRank.fromJson(response.json));
    }

    public getByOfferId(offerId: number): Promise<Array<OfferRank>> {
        const url = `${this.OFFER_RANK_API}/${offerId}`;
        return this.transport.sendRequest<Array<OfferRank>>(
            url,
            HttpMethod.Get
        ).then(response => {
            return this.jsonToListOfferRanks(response.json);
        });
    }

    public getById(offerRankId: number): Promise<OfferRank> {
        return this.transport.sendRequest<OfferRank>(
            this.OFFER_RANK_API,
            HttpMethod.Get,
            {offerRankId}
        ).then(response => OfferRank.fromJson(response.json));
    }

    public save(rank: OfferRank): Promise<OfferRank> {
        return this.transport.sendRequest<OfferRank>(
            this.OFFER_RANK_API,
            HttpMethod.Post,
            rank.toJson()
        ).then(response => OfferRank.fromJson(response.json));
    }

    public update(rank: OfferRank): Promise<OfferRank> {
        return this.transport.sendRequest<OfferRank>(
            this.OFFER_RANK_API,
            HttpMethod.Put,
            rank.toJson()
        ).then(response => OfferRank.fromJson(response.json));
    }

    public delete(offerRankId: number): Promise<number> {
        return this.transport.sendRequest<string>(
            this.OFFER_RANK_API,
            HttpMethod.Delete,
            {offerRankId}
        ).then(response => parseInt(response.toString(), 10));
    }

    private jsonToListOfferRanks(json: JsonObject<Array<OfferRank>>): Array<OfferRank> {
        return Object.keys(json).map(key => OfferRank.fromJson(json[key] as object));
    }
}
