import Offer from './../models/Offer';
import OfferSearch from './../models/OfferSearch';
import OfferSearchResultItem from './../models/OfferSearchResultItem';
import { OfferSearchRepository } from './OfferSearchRepository';

const fetch = require('node-fetch');

export default class OfferSearchRepositoryImpl implements OfferSearchRepository {

    private readonly OFFER_SEARCH_API = '/v1/search/result/?searchResultId={searchResultId}';
    private host: string;

    constructor(host: string) {
        this.host = host;
    }

    async getOfferSearchItem(clientId: string, searchResultId: number): Promise<OfferSearchResultItem> {
        const url = this.host + this.OFFER_SEARCH_API
            // .replace('{clientId}', clientId)
            .replace('{searchResultId}', searchResultId.toString());

        const response = await fetch(url, {method: 'GET'});
        const json = await response.json();
        const result = this.jsonToListResult(json);

        return result[0];
    }

    private jsonToListResult(json: any): Array<OfferSearchResultItem> {
        const result: Array<OfferSearchResultItem> = [];

        for (let item of json) {
            result.push(new OfferSearchResultItem(
                Object.assign(new OfferSearch(), item.offerSearch),
                Offer.fromJson(item.offer)
            ));
        }

        return result;
    }

}
