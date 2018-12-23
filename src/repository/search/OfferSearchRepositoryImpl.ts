import { OfferSearchRepository } from './OfferSearchRepository';
import OfferSearchResultItem from '../models/OfferSearchResultItem';
import OfferSearch from '../models/OfferSearch';
import { HttpTransport } from '../source/http/HttpTransport';
import { HttpMethod } from '../source/http/HttpMethod';
import Offer from '../models/Offer';

export class OfferSearchRepositoryImpl implements OfferSearchRepository {

    private readonly OFFER_SEARCH_API = '/v1/search/result/{id}';
    private readonly OFFER_SEARCH_ADD_API = '/v1/search/result/';

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    public getSearchResult(clientId: string, searchRequestId: number): Promise<Array<OfferSearchResultItem>> {
        return this.transport.sendRequest(
            this.OFFER_SEARCH_ADD_API + `?searchRequestId=${searchRequestId}`,
                // .replace('{clientId}', clientId)
                // .replace('{id}', '') + `?searchRequestId=${searchRequestId}`,
            HttpMethod.Get
        ).then((response) => this.jsonToListResult(response.json));
    }

    public complainToSearchItem(clientId: string, searchResultId: number): Promise<any> {
        return this.transport.sendRequest(
            this.OFFER_SEARCH_API
                // .replace('{clientId}', clientId)
                .replace('{id}', searchResultId.toString()) + `?searchResultId=${searchResultId}`,
            HttpMethod.Patch,
            searchResultId
        );
    }

    public addResultItem(clientId: string, offerSearch: OfferSearch): Promise<any> {
        return this.transport.sendRequest(
            // this.OFFER_SEARCH_ADD_API.replace('{clientId}', clientId),
            this.OFFER_SEARCH_ADD_API,
            HttpMethod.Post,
            offerSearch
        );
    }

    private async jsonToListResult(json: any): Promise<Array<OfferSearchResultItem>> {
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
