import { OfferInteraction, OfferResultAction } from '../../repository/models/OfferInteraction';
import { OfferSearch } from '../../repository/models/OfferSearch';
import OfferSearchResultItem from '../../repository/models/OfferSearchResultItem';
import { Page } from '../../repository/models/Page';
import { Pair } from '../../repository/models/Pair';
import SearchRequest from '../../repository/models/SearchRequest';
import { OfferSearchRequestInterestMode } from '../../repository/search/OfferSearchRepository';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { JsonUtils } from '../../utils/JsonUtils';
import { ArrayDeserializer } from '../../utils/types/json-transform/deserializers/ArrayDeserializer';
import { PageDeserializer } from '../../utils/types/json-transform/deserializers/PageDeserializer';
import { SearchRequestDeserializer } from '../../utils/types/json-transform/deserializers/SearchRequestDeserializer';
import { SimpleMapDeserializer } from '../../utils/types/json-transform/deserializers/SimpleMapDeserializer';
import { SearchManager, SortOfferSearch } from '../SearchManager';

export class RemoteSearchManagerImpl implements SearchManager {

    constructor(private readonly transport: RpcTransport) {
    }

    public addEventToOfferSearch(event: string, offerSearchId: number): Promise<void> {
        return this.transport.request('searchManager.addEventToOfferSearch', [event, offerSearchId]);
    }

    public addResultItem(offerSearch: OfferSearch): Promise<void> {
        return this.transport.request('searchManager.addResultItem', [offerSearch.toJson()]);
    }

    public claimPurchaseForSearchItem(searchResultId: number): Promise<void> {
        return this.transport.request('searchManager.claimPurchaseForSearchItem', [searchResultId]);
    }

    public cloneOfferSearch(originToCopySearchRequestIds: Array<Pair<number, number>>): Promise<Array<OfferSearch>> {
        return this.transport.request(
            'searchManager.cloneOfferSearch',
            [originToCopySearchRequestIds],
            new ArrayDeserializer(OfferSearch)
        );
    }

    public cloneRequest(searchRequestIds: Array<number>): Promise<Array<SearchRequest>> {
        return this.transport.request(
            'searchManager.cloneRequest',
            [searchRequestIds],
            new ArrayDeserializer(SearchRequest)
        );
    }

    public complainToSearchItem(searchResultId: number): Promise<void> {
        return this.transport.request('searchManager.complainToSearchItem', [searchResultId]);
    }

    public confirmSearchItem(searchResultId: number): Promise<void> {
        return this.transport.request('searchManager.confirmSearchItem', [searchResultId]);
    }

    public createRequest(searchRequest: SearchRequest): Promise<SearchRequest> {
        return this.transport.request('searchManager.createRequest', [searchRequest.toJson()], SearchRequest);
    }

    public createSearchResultByQuery(
        query: string,
        searchRequestId: number,
        page?: number,
        size?: number,
        interests?: Array<string>,
        mode?: OfferSearchRequestInterestMode,
        filters?: Map<string, Array<string>>
    ): Promise<Page<OfferSearchResultItem>> {
        const filtersJson: object | undefined = filters ? JsonUtils.mapToJson(filters) : undefined;

        return this.transport.request(
            'searchManager.createSearchResultByQuery',
            [query, searchRequestId, page, size, interests, mode, filtersJson],
            new PageDeserializer(OfferSearchResultItem)
        );
    }

    public deleteRequest(id: number): Promise<number> {
        return this.transport.request('searchManager.deleteRequest', [id]);
    }

    public evaluateSearchItem(searchResultId: number): Promise<void> {
        return this.transport.request('searchManager.evaluateSearchItem', [searchResultId]);
    }

    public getCountBySearchRequestIds(searchRequestIds: Array<number>): Promise<Map<number, number>> {
        return this.transport.request<Map<number, number>>(
            'searchManager.getCountBySearchRequestIds',
            [searchRequestIds],
            new SimpleMapDeserializer()
        );
    }

    public getInteractions(
        offerIds?: Array<number> | undefined,
        states?: Array<OfferResultAction> | undefined,
        owner?: string | undefined
    ): Promise<Array<OfferInteraction>> {
        return this.transport.request(
            'searchManager.getInteractions',
            [offerIds, states, owner],
            new ArrayDeserializer(OfferInteraction)
        );
    }

    public getMyRequests(id?: number): Promise<Array<SearchRequest>> {
        return this.transport.request('searchManager.getMyRequests', [id], new ArrayDeserializer(SearchRequest));
    }

    public getMySearchRequestsByTag(tag: string): Promise<Array<SearchRequest>> {
        return this.transport.request(
            'searchManager.getMySearchRequestsByTag',
            [tag],
            new ArrayDeserializer(SearchRequest)
        );
    }

    public getRequestsByOwnerAndId(owner: string, id?: number): Promise<Array<SearchRequest>> {
        return this.transport.request(
            'searchManager.getRequestsByOwnerAndId',
            [owner, id],
            new ArrayDeserializer(SearchRequest)
        );
    }

    public getRequestsByPage(page?: number, size?: number): Promise<Page<SearchRequest>> {
        return this.transport.request(
            'searchManager.getRequestsByPage',
            [page, size],
            new PageDeserializer(SearchRequest)
        );
    }

    public getSearchRequestsByOwnerAndTag(owner: string, tag: string): Promise<Array<SearchRequest>> {
        return this.transport.request(
            'searchManager.getSearchRequestsByOwnerAndTag',
            [owner, tag],
            new ArrayDeserializer(SearchRequest)
        );
    }

    public getSearchResult(
        searchRequestId: number,
        page?: number,
        size?: number
    ): Promise<Page<OfferSearchResultItem>> {
        return this.transport.request(
            'searchManager.getSearchResult',
            [searchRequestId, page, size],
            new PageDeserializer(OfferSearchResultItem)
        );
    }

    public getSearchResultByOfferSearchId(
        offerSearchId: number,
        page?: number,
        size?: number
    ): Promise<Page<OfferSearchResultItem>> {
        return this.transport.request(
            'searchManager.getSearchResultByOfferSearchId',
            [offerSearchId, page, size],
            new PageDeserializer(OfferSearchResultItem)
        );
    }

    public getSuggestionByQuery(query: string, size?: number): Promise<Array<string>> {
        return this.transport.request('searchManager.getSuggestionByQuery', [query, size]);
    }

    public getUserOfferSearches(
        page?: number,
        size?: number,
        unique?: boolean,
        searchIds?: Array<number>,
        state?: Array<OfferResultAction>,
        sort?: SortOfferSearch,
        interaction?: boolean
    ): Promise<Page<OfferSearchResultItem>> {
        return this.transport.request(
            'searchManager.getUserOfferSearches',
            [page, size, unique, searchIds, state, sort, interaction],
            new PageDeserializer(OfferSearchResultItem)
        );
    }

    public rejectSearchItem(searchResultId: number): Promise<void> {
        return this.transport.request('searchManager.rejectSearchItem', [searchResultId]);
    }

    public updateRequest(
        searchRequest: SearchRequest | Array<SearchRequest>
    ): Promise<SearchRequest | Array<SearchRequest>> {
        const request = searchRequest instanceof Array
                        ? searchRequest.map(item => item.toJson())
                        : searchRequest.toJson();

        return this.transport.request('searchManager.updateRequest', [request], new SearchRequestDeserializer());
    }
}
