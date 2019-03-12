import SearchRequest from '../repository/models/SearchRequest';
import OfferSearchResultItem from '../repository/models/OfferSearchResultItem';
import OfferSearch from '../repository/models/OfferSearch';
import { Page } from '../repository/models/Page';

export interface SearchManager {

    createRequest(searchRequest: SearchRequest): Promise<SearchRequest>;

    updateRequest(searchRequest: SearchRequest): Promise<SearchRequest>;

    cloneRequest(searchRequest: SearchRequest): Promise<SearchRequest>;

    cloneOfferSearch(id: number, searchRequest: SearchRequest): Promise<OfferSearch[]>;

    getMyRequests(id: number): Promise<Array<SearchRequest>>;

    getAllRequests(): Promise<Array<SearchRequest>>;

    deleteRequest(id: number): Promise<number>;

    createSearchResultByQuery(
        query: string,
        searchRequestId: number,
        page?: number,
        size?: number
    ): Promise<Page<OfferSearchResultItem>>;

    getSearchResult(searchRequestId: number): Promise<Array<OfferSearchResultItem>>;

    getSearchResultByOfferSearchId(offerSearchId: number): Promise<Array<OfferSearchResultItem>>;

    getCountBySearchRequestIds(searchRequestIds: Array<number>): Promise<Map<number, number>>

    getUserOfferSearches(): Promise<Array<OfferSearchResultItem>>;

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
