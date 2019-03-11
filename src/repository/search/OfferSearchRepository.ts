import OfferSearchResultItem from '../models/OfferSearchResultItem';
import OfferSearch from '../models/OfferSearch';
import SearchRequest from '../models/SearchRequest';
import { Page } from '../models/Page';

export interface OfferSearchRepository {
    createByQuery(owner: string, query: string, searchRequestId: number): Promise<Page<OfferSearchResultItem>>;

    getUserOfferSearches(clientId: string): Promise<Array<OfferSearchResultItem>>;

    getSearchResult(clientId: string, searchRequestId: number): Promise<Array<OfferSearchResultItem>>;

    getSearchResultByOfferSearchId(clientId: string, offerSearchId: number): Promise<Array<OfferSearchResultItem>>;

    complainToSearchItem(clientId: string, searchResultId: number): Promise<void>;

    rejectSearchItem(clientId: string, searchResultId: number): Promise<void>;

    evaluateSearchItem(clientId: string, searchResultId: number): Promise<void>;

    confirmSearchItem(clientId: string, searchResultId: number): Promise<void>;

    claimPurchaseForSearchItem(clientId: string, searchResultId: number): Promise<void>;

    addResultItem(clientId: string, offerSearch: OfferSearch): Promise<void>;

    addEventToOfferSearch(event: string, offerSearchId: number): Promise<void>;

    clone(owner: string, id: number, searchRequest: SearchRequest): Promise<Array<OfferSearch>>;
}
