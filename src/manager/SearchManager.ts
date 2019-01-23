import SearchRequest from '../repository/models/SearchRequest';
import OfferSearchResultItem from '../repository/models/OfferSearchResultItem';
import OfferSearch from '../repository/models/OfferSearch';

export interface SearchManager {

    createRequest(searchRequest: SearchRequest): Promise<SearchRequest>;

    getMyRequests(id: number): Promise<Array<SearchRequest>>;

    getAllRequests(): Promise<Array<SearchRequest>>;

    deleteRequest(id: number): Promise<number>;

    getSearchResult(searchRequestId: number): Promise<Array<OfferSearchResultItem>>;
    getSearchResultByOfferSearchId(offerSearchId: number): Promise<Array<OfferSearchResultItem>>;

    complainToSearchItem(searchResultId: number): Promise<void>;
    rejectSearchItem(searchResultId: number): Promise<void>;
    evaluateSearchItem(searchResultId: number): Promise<void>;
    confirmSearchItem(searchResultId: number): Promise<void>;

    addResultItem(offerSearch: OfferSearch): Promise<void>;
    addEventToOfferSearch(event: string, offerSearchId: number): Promise<void>;

}
