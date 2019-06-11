import OfferSearch, { OfferResultAction } from '../repository/models/OfferSearch';
import OfferSearchResultItem from '../repository/models/OfferSearchResultItem';
import { Page } from '../repository/models/Page';
import SearchRequest from '../repository/models/SearchRequest';
import { OfferSearchRequestInterestMode } from '../repository/search/OfferSearchRepository';

export interface SearchManager {

    createRequest(searchRequest: SearchRequest): Promise<SearchRequest>;

    updateRequest(searchRequest: SearchRequest): Promise<SearchRequest>;

    cloneRequest(searchRequest: SearchRequest): Promise<SearchRequest>;

    cloneOfferSearch(id: number, searchRequest: SearchRequest): Promise<Array<OfferSearch>>;

    getMyRequests(id?: number): Promise<Array<SearchRequest>>;

    getRequestsByOwnerAndId(owner: string, id?: number): Promise<Array<SearchRequest>>;

    getAllRequests(): Promise<Array<SearchRequest>>;

    deleteRequest(id: number): Promise<number>;

    createSearchResultByQuery(
        query: string,
        searchRequestId: number,
        page?: number,
        size?: number,
        interests?: Array<string>,
        mode?: OfferSearchRequestInterestMode
    ): Promise<Page<OfferSearchResultItem>>;

    getSearchResult(searchRequestId: number): Promise<Page<OfferSearchResultItem>>;

    getSearchResultByOfferSearchId(offerSearchId: number): Promise<Page<OfferSearchResultItem>>;

    getCountBySearchRequestIds(searchRequestIds: Array<number>): Promise<Map<number, number>>;

    getUserOfferSearches(
        page?: number,
        size?: number,
        unique?: boolean,
        searchIds?: Array<number>,
        state?: Array<OfferResultAction>,
        sort?: SortOfferSearch
    ): Promise<Page<OfferSearchResultItem>>;

    complainToSearchItem(searchResultId: number): Promise<void>;

    rejectSearchItem(searchResultId: number): Promise<void>;

    evaluateSearchItem(searchResultId: number): Promise<void>;

    confirmSearchItem(searchResultId: number): Promise<void>;

    claimPurchaseForSearchItem(searchResultId: number): Promise<void>;

    addResultItem(offerSearch: OfferSearch): Promise<void>;

    addEventToOfferSearch(event: string, offerSearchId: number): Promise<void>;

    getSearchRequestsByOwnerAndTag(owner: string, tag: string): Promise<Array<SearchRequest>>;

    getMySearchRequestsByTag(tag: string): Promise<Array<SearchRequest>>;

}
export enum SortOfferSearch { rank = 'rank', updatedAt = 'updatedAt', price = 'price', cashback = 'cashback'}
