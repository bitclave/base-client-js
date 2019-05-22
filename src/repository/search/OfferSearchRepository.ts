import { SortOfferSearch } from '../../manager/SearchManager';
import OfferSearch, { OfferResultAction } from '../models/OfferSearch';
import OfferSearchResultItem from '../models/OfferSearchResultItem';
import { Page } from '../models/Page';
import SearchRequest from '../models/SearchRequest';

export interface OfferSearchRepository {
    createByQuery(
        owner: string,
        query: string,
        searchRequestId: number,
        page?: number,
        size?: number
    ): Promise<Page<OfferSearchResultItem>>;

    getUserOfferSearches(
        clientId: string,
        page?: number,
        size?: number,
        unique?: boolean,
        searchIds?: Array<number>,
        state?: Array<OfferResultAction>,
        sort?: SortOfferSearch
    ): Promise<Page<OfferSearchResultItem>>;

    getSearchResult(clientId: string, searchRequestId: number): Promise<Page<OfferSearchResultItem>>;

    getSearchResultByOfferSearchId(clientId: string, offerSearchId: number): Promise<Page<OfferSearchResultItem>>;

    getCountBySearchRequestIds(searchRequestIds: Array<number>): Promise<Map<number, number>>;

    complainToSearchItem(clientId: string, searchResultId: number): Promise<void>;

    rejectSearchItem(clientId: string, searchResultId: number): Promise<void>;

    evaluateSearchItem(clientId: string, searchResultId: number): Promise<void>;

    confirmSearchItem(clientId: string, searchResultId: number): Promise<void>;

    claimPurchaseForSearchItem(clientId: string, searchResultId: number): Promise<void>;

    addResultItem(clientId: string, offerSearch: OfferSearch): Promise<void>;

    addEventToOfferSearch(event: string, offerSearchId: number): Promise<void>;

    clone(owner: string, id: number, searchRequest: SearchRequest): Promise<Array<OfferSearch>>;
}
