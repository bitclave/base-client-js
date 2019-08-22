import { SortOfferSearch } from '../../manager/SearchManager';
import { JsonUtils } from '../../utils/JsonUtils';
import { JsonObject } from '../models/JsonObject';
import Offer from '../models/Offer';
import { OfferInteraction, OfferResultAction } from '../models/OfferInteraction';
import { OfferSearch } from '../models/OfferSearch';
import OfferSearchResultItem from '../models/OfferSearchResultItem';
import { Page } from '../models/Page';
import { Pair } from '../models/Pair';
import { SearchByQueryParams } from '../models/SearchByQueryParams';
import { SignedSearchByQueryParams } from '../models/SignedSearchByQueryParams';
import { HttpMethod } from '../source/http/HttpMethod';
import { HttpTransport } from '../source/http/HttpTransport';
import { OfferSearchRepository, OfferSearchRequestInterestMode } from './OfferSearchRepository';

export class OfferSearchRepositoryImpl implements OfferSearchRepository {

    private readonly OFFER_SEARCH_API = '/v1/search/result/{id}';
    private readonly OFFER_SEARCH_REJECT_API = '/v1/search/result/reject/{id}';
    private readonly OFFER_SEARCH_EVALUATE_API = '/v1/search/result/evaluate/{id}';
    private readonly OFFER_SEARCH_CONFIRM_API = '/v1/search/result/confirm/{id}';
    private readonly OFFER_SEARCH_CLAIM_PURCHASE_API = '/v1/search/result/claimpurchase/{id}';
    private readonly OFFER_SEARCH_ADD_API = '/v1/search/result/';
    private readonly OFFER_SEARCH_ADD_API_V2 = '/v2/search/result/';
    private readonly OFFER_SEARCH_BY_PARAMS_API =
        '/v1/search/result/user?owner={owner}&searchIds={searchIds}' +
        '&state={state}&unique={unique}&page={page}&size={size}&sort={sort}&interaction={interaction}';

    private readonly INTERACTIONS_API = '/v1/search/result/interaction?owner={owner}&offers={offers}&states={states}';

    private readonly OFFER_SEARCH_GET_BY_REQUEST_OR_SEARCH_API =
        '/v1/search/result?searchRequestId={searchRequestId}&offerSearchId={offerSearchId}&page={page}&size={size}';
    private readonly OFFER_SEARCH_ADD_EVENT_API = '/v1/search/result/event/{id}';
    private readonly OFFER_SEARCH_CREATE_BY_QUERY_API: string =
        '/v1/search/query?q={query}&page={page}&size={size}&mode={mode}';
    private readonly OFFER_SEARCH_SUGGESTION_BY_QUERY_API: string =
        '/v1/search/query/suggest?q={query}&s={size}';
    private readonly OFFER_SEARCH_COUNT_BY_REQUEST_IDS_API: string = '/v1/search/count?ids={ids}';

    constructor(private readonly transport: HttpTransport) {
        this.transport = transport;
    }

    public getSuggestionByQuery(query: string, size?: number | undefined): Promise<Array<string>> {
        return this.transport.sendRequest(
            this.OFFER_SEARCH_SUGGESTION_BY_QUERY_API
                .replace('{query}', encodeURIComponent(query))
                .replace('{size}', (size || 10).toString())
            ,
            HttpMethod.Get,
        ).then((response) => response.originJson as Array<string>);
    }

    public createByQuery(
        owner: string,
        query: string,
        searchRequestId: number,
        page: number = 0,
        size: number = 20,
        interests?: Array<string>,
        mode?: OfferSearchRequestInterestMode,
        filters?: Map<string, Array<string>>
    ): Promise<Page<OfferSearchResultItem>> {

        let data;

        if ((interests && interests.length > 0) || (filters && filters.size > 0) || searchRequestId > 0) {
            data = !owner || owner.length === 0
                   ? new SearchByQueryParams(searchRequestId, filters)
                   : new SignedSearchByQueryParams(searchRequestId, filters);

            data.setInterests(interests);
        }

        return this.transport.sendRequest<Page<OfferSearchResultItem>>(
            this.OFFER_SEARCH_CREATE_BY_QUERY_API
                .replace('{query}', encodeURIComponent(query))
                .replace('{page}', (page || 0).toString())
                .replace('{size}', (size || 20).toString())
                .replace('{mode}', (mode || '').toString())
            ,
            HttpMethod.Post,
            data
        ).then((response) => this.jsonToPageResultItem(response.json));
    }

    public getUserOfferSearches(
        clientId: string,
        page: number = 0,
        size: number = 20,
        unique: boolean = false,
        searchIds: Array<number> = [],
        state: Array<OfferResultAction> = [],
        sort: SortOfferSearch,
        interaction?: boolean
    ): Promise<Page<OfferSearchResultItem>> {
        return this.transport.sendRequest<Page<OfferSearchResultItem>>(
            this.OFFER_SEARCH_BY_PARAMS_API
                .replace('{owner}', clientId)
                .replace('{page}', (page || 0).toString())
                .replace('{size}', (size || 20).toString())
                .replace('{searchIds}', (searchIds || []).join(','))
                .replace('{state}', (state || []).join(','))
                .replace('{unique}', (unique ? '1' : '0'))
                .replace('{sort}', sort && sort.toString())
                .replace('{interaction}', interaction === true ? '1' : '0')
            ,
            HttpMethod.Get
        ).then((response) => this.jsonToPageResultItem(response.json));
    }

    public getSearchResult(
        clientId: string,
        searchRequestId: number,
        page?: number,
        size?: number
    ): Promise<Page<OfferSearchResultItem>> {
        return this.transport.sendRequest<Page<OfferSearchResultItem>>(
            this.OFFER_SEARCH_GET_BY_REQUEST_OR_SEARCH_API
                .replace('{searchRequestId}', searchRequestId.toString())
                .replace('{offerSearchId}', '0')
                .replace('{page}', (page || 0).toString())
                .replace('{size}', (size || 20).toString()),
            HttpMethod.Get
        ).then((response) => this.jsonToPageResultItem(response.json));
    }

    public getSearchResultByOfferSearchId(
        clientId: string,
        offerSearchId: number,
        page?: number,
        size?: number
    ): Promise<Page<OfferSearchResultItem>> {
        return this.transport.sendRequest<Page<OfferSearchResultItem>>(
            this.OFFER_SEARCH_GET_BY_REQUEST_OR_SEARCH_API
                .replace('{searchRequestId}', '0')
                .replace('{offerSearchId}', offerSearchId.toString())
                .replace('{page}', (page || 0).toString())
                .replace('{size}', (size || 20).toString()),
            HttpMethod.Get
        ).then((response) => this.jsonToPageResultItem(response.json));
    }

    public getCountBySearchRequestIds(searchRequestIds: Array<number>): Promise<Map<number, number>> {
        return this.transport.sendRequest(
            this.OFFER_SEARCH_COUNT_BY_REQUEST_IDS_API
                .replace('{ids}', searchRequestIds.join(',')),
            HttpMethod.Get
        ).then((response) => JsonUtils.jsonToMap<number, number>(response.json));
    }

    public getInteractions(
        owner: string,
        offerIds?: Array<number> | undefined,
        states?: Array<OfferResultAction> | undefined,
    ): Promise<Array<OfferInteraction>> {

        return this.transport.sendRequest<Array<OfferInteraction>>(
            this.INTERACTIONS_API
                .replace('{owner}', owner)
                .replace('{offers}', offerIds ? offerIds.join(',') : '')
                .replace('{states}', states ? states.join(',') : ''),
            HttpMethod.Get
        ).then((response) => this.jsonToOfferInteractionList(response.json));
    }

    public async complainToSearchItem(clientId: string, searchResultId: number): Promise<void> {
        await this.transport.sendRequest(
            this.OFFER_SEARCH_API
            // .replace('{clientId}', clientId)
                .replace('{id}', searchResultId.toString()) + `?searchResultId=${searchResultId}`,
            HttpMethod.Patch,
            searchResultId
        );
    }

    public async rejectSearchItem(clientId: string, searchResultId: number): Promise<void> {
        await this.transport.sendRequest(
            this.OFFER_SEARCH_REJECT_API
                .replace('{id}', searchResultId.toString()) + `?searchResultId=${searchResultId}`,
            HttpMethod.Patch,
            searchResultId
        );
    }

    public async evaluateSearchItem(clientId: string, searchResultId: number): Promise<void> {
        await this.transport.sendRequest(
            this.OFFER_SEARCH_EVALUATE_API
                .replace('{id}', searchResultId.toString()) + `?searchResultId=${searchResultId}`,
            HttpMethod.Patch,
            searchResultId
        );
    }

    public async confirmSearchItem(clientId: string, searchResultId: number): Promise<void> {
        await this.transport.sendRequest(
            this.OFFER_SEARCH_CONFIRM_API
                .replace('{id}', searchResultId.toString()) + `?searchResultId=${searchResultId + 1}`,
            HttpMethod.Patch,
            searchResultId
        );
    }

    public async claimPurchaseForSearchItem(clientId: string, searchResultId: number): Promise<void> {
        await this.transport.sendRequest(
            this.OFFER_SEARCH_CLAIM_PURCHASE_API
                .replace('{id}', searchResultId.toString()) + `?searchResultId=${searchResultId + 1}`,
            HttpMethod.Patch,
            searchResultId
        );
    }

    public async addResultItem(clientId: string, offerSearch: OfferSearch): Promise<void> {
        await this.transport.sendRequest(
            // this.OFFER_SEARCH_ADD_API.replace('{clientId}', clientId),
            this.OFFER_SEARCH_ADD_API,
            HttpMethod.Post,
            offerSearch.toJson()
        );
    }

    public async addEventToOfferSearch(event: string, offerSearchId: number): Promise<void> {
        await this.transport.sendRequest(
            this.OFFER_SEARCH_ADD_EVENT_API.replace('{id}', offerSearchId.toString()),
            HttpMethod.Patch,
            event
        );
    }

    public clone(
        owner: string,
        originToCopySearchRequestIds: Array<Pair<number, number>>
    ): Promise<Array<OfferSearch>> {
        return this.transport.sendRequest<Array<OfferSearch>>(
            this.OFFER_SEARCH_ADD_API_V2 + owner,
            HttpMethod.Put,
            originToCopySearchRequestIds
        ).then((response) => this.jsonToOfferSearchList(response.json));
    }

    private async jsonToPageResultItem(
        json: JsonObject<Page<OfferSearchResultItem>>
    ): Promise<Page<OfferSearchResultItem>> {
        json.content = await this.jsonToListResult(json.content as JsonObject<Array<OfferSearchResultItem>>);
        return Page.fromJson(json, OfferSearchResultItem);
    }

    private async jsonToListResult(
        json: JsonObject<Array<OfferSearchResultItem>>
    ): Promise<Array<OfferSearchResultItem>> {
        return Object.keys(json)
            .map(key => {
                    const rawOfferSearch = json[key] as JsonObject<OfferSearchResultItem>;
                    return new OfferSearchResultItem(
                        OfferSearch.fromJson(rawOfferSearch.offerSearch as object),
                        Offer.fromJson(rawOfferSearch.offer as object),
                        rawOfferSearch.interaction
                        ? OfferInteraction.fromJson(rawOfferSearch.interaction as object)
                        : undefined
                    );
                }
            );
    }

    private async jsonToOfferSearchList(json: JsonObject<Array<OfferSearch>>): Promise<Array<OfferSearch>> {
        return Object.keys(json).map(key => OfferSearch.fromJson(json[key] as object));
    }

    private async jsonToOfferInteractionList(
        json: JsonObject<Array<OfferInteraction>>
    ): Promise<Array<OfferInteraction>> {
        return Object.keys(json).map(key => OfferInteraction.fromJson(json[key] as object));
    }
}
