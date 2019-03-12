import { OfferSearchRepository } from './OfferSearchRepository';
import OfferSearchResultItem from '../models/OfferSearchResultItem';
import OfferSearch from '../models/OfferSearch';
import { HttpTransport } from '../source/http/HttpTransport';
import { HttpMethod } from '../source/http/HttpMethod';
import Offer from '../models/Offer';
import SearchRequest from '../models/SearchRequest';
import { Page } from '../models/Page';
import { JsonUtils } from '../../utils/JsonUtils';

export class OfferSearchRepositoryImpl implements OfferSearchRepository {

    private readonly OFFER_SEARCH_API = '/v1/search/result/{id}';
    private readonly OFFER_SEARCH_REJECT_API = '/v1/search/result/reject/{id}';
    private readonly OFFER_SEARCH_EVALUATE_API = '/v1/search/result/evaluate/{id}';
    private readonly OFFER_SEARCH_CONFIRM_API = '/v1/search/result/confirm/{id}';
    private readonly OFFER_SEARCH_CLAIM_PURCHASE_API = '/v1/search/result/claimpurchase/{id}';
    private readonly OFFER_SEARCH_ADD_API = '/v1/search/result/';
    private readonly OFFER_SEARCH_ADD_EVENT_API = '/v1/search/result/event/{id}';
    private readonly OFFER_SEARCH_CREATE_BY_QUERY_API: string = '/v1/search/query?q={query}&page={page}&size={size}';
    private readonly OFFER_SEARCH_COUNT_BY_REQUEST_IDS_API: string = '/v1/search/count?ids={ids}';
    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    public createByQuery(
        owner: string,
        query: string,
        searchRequestId: number,
        page?: number,
        size?: number
    ): Promise<Page<OfferSearchResultItem>> {
        return this.transport.sendRequest(
            this.OFFER_SEARCH_CREATE_BY_QUERY_API
                .replace('{query}', query)
                .replace('{page}', (page || 0).toString())
                .replace('{size}', (size || 20).toString())
            ,
            HttpMethod.Post,
            searchRequestId
        ).then((response) => this.jsonToPageResultItem(response.json));
    }

    public getUserOfferSearches(clientId: string): Promise<any> {
        return this.transport.sendRequest(
            this.OFFER_SEARCH_ADD_API + `user?owner=${clientId}`,
            HttpMethod.Get
        ).then((response) => this.jsonToListResult(response.json));
    }

    public getSearchResult(clientId: string, searchRequestId: number): Promise<Array<OfferSearchResultItem>> {
        return this.transport.sendRequest(
            this.OFFER_SEARCH_ADD_API + `?searchRequestId=${searchRequestId}`,
            // .replace('{clientId}', clientId)
            // .replace('{id}', '') + `?searchRequestId=${searchRequestId}`,
            HttpMethod.Get
        ).then((response) => this.jsonToListResult(response.json));
    }

    public getSearchResultByOfferSearchId(clientId: string, offerSearchId: number): Promise<Array<OfferSearchResultItem>> {
        return this.transport.sendRequest(
            this.OFFER_SEARCH_ADD_API + `?offerSearchId=${offerSearchId}`,
            HttpMethod.Get
        ).then((response) => this.jsonToListResult(response.json));
    }

    public getCountBySearchRequestIds(searchRequestIds: Array<number>): Promise<Map<number, number>> {
        return this.transport.sendRequest(
            this.OFFER_SEARCH_COUNT_BY_REQUEST_IDS_API
                .replace('{ids}', searchRequestIds.join(',')),
            HttpMethod.Get
        ).then((response) => JsonUtils.jsonToMap<number, number>(response.json));
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

    public rejectSearchItem(clientId: string, searchResultId: number): Promise<any> {
        return this.transport.sendRequest(
            this.OFFER_SEARCH_REJECT_API
                .replace('{id}', searchResultId.toString()) + `?searchResultId=${searchResultId}`,
            HttpMethod.Patch,
            searchResultId
        );
    }

    public evaluateSearchItem(clientId: string, searchResultId: number): Promise<any> {
        return this.transport.sendRequest(
            this.OFFER_SEARCH_EVALUATE_API
                .replace('{id}', searchResultId.toString()) + `?searchResultId=${searchResultId}`,
            HttpMethod.Patch,
            searchResultId
        );
    }

    public confirmSearchItem(clientId: string, searchResultId: number): Promise<any> {
        return this.transport.sendRequest(
            this.OFFER_SEARCH_CONFIRM_API
                .replace('{id}', searchResultId.toString()) + `?searchResultId=${searchResultId + 1}`,
            HttpMethod.Patch,
            searchResultId
        );
    }

    public claimPurchaseForSearchItem(clientId: string, searchResultId: number): Promise<any> {
        return this.transport.sendRequest(
            this.OFFER_SEARCH_CLAIM_PURCHASE_API
                .replace('{id}', searchResultId.toString()) + `?searchResultId=${searchResultId + 1}`,
            HttpMethod.Patch,
            searchResultId
        );
    }

    public addResultItem(clientId: string, offerSearch: OfferSearch): Promise<any> {
        return this.transport.sendRequest(
            // this.OFFER_SEARCH_ADD_API.replace('{clientId}', clientId),
            this.OFFER_SEARCH_ADD_API,
            HttpMethod.Post,
            offerSearch.toJson()
        );
    }

    public addEventToOfferSearch(event: string, offerSearchId: number): Promise<any> {
        return this.transport.sendRequest(
            this.OFFER_SEARCH_ADD_EVENT_API.replace('{id}', offerSearchId.toString()),
            HttpMethod.Patch,
            event
        );
    }

    public clone(owner: string, id: number, searchRequest: SearchRequest): Promise<Array<OfferSearch>> {
        return this.transport.sendRequest(
            this.OFFER_SEARCH_ADD_API + owner + '/' + id,
            HttpMethod.Put,
            searchRequest.toJson()
        ).then((response) => this.jsonToOfferSearchList(response.json));
    }

    private async jsonToPageResultItem(json: any): Promise<Page<OfferSearchResultItem>> {
        json.content = await this.jsonToListResult(json.content);
        return Page.fromJson(json, OfferSearchResultItem);
    }

    private async jsonToListResult(json: any): Promise<Array<OfferSearchResultItem>> {
        const result: Array<OfferSearchResultItem> = [];

        for (let item of json) {
            result.push(new OfferSearchResultItem(
                OfferSearch.fromJson(item.offerSearch),
                Offer.fromJson(item.offer)
            ));
        }

        return result;
    }

    private async jsonToOfferSearchList(json: any): Promise<Array<OfferSearch>> {
        const result: Array<OfferSearch> = [];

        for (let item of json) {
            result.push(OfferSearch.fromJson(item));
        }

        return result;
    }

}
