import { SortOfferSearch } from '../../manager/SearchManager';
import { OfferInteraction, OfferResultAction } from '../models/OfferInteraction';
import { OfferSearch } from '../models/OfferSearch';
import OfferSearchResultItem from '../models/OfferSearchResultItem';
import { Page } from '../models/Page';
import { Pair } from '../models/Pair';

export enum OfferSearchRequestInterestMode { must = 'must', prefer = 'prefer'}

export interface OfferSearchRepository {

    getSuggestionByQuery(query: string, size?: number | undefined): Promise<Array<string>>;

    createByQuery(
        owner: string,
        query: string,
        searchRequestId: number,
        page?: number,
        size?: number,
        interests?: Array<string>,
        mode?: OfferSearchRequestInterestMode
    ): Promise<Page<OfferSearchResultItem>>;

    getUserOfferSearches(
        clientId: string,
        page?: number,
        size?: number,
        unique?: boolean,
        searchIds?: Array<number>,
        state?: Array<OfferResultAction>,
        sort?: SortOfferSearch,
        interaction?: boolean
    ): Promise<Page<OfferSearchResultItem>>;

    getSearchResult(
        clientId: string,
        searchRequestId: number,
        page?: number,
        size?: number
    ): Promise<Page<OfferSearchResultItem>>;

    getSearchResultByOfferSearchId(
        clientId: string,
        offerSearchId: number,
        page?: number,
        size?: number
    ): Promise<Page<OfferSearchResultItem>>;

    getCountBySearchRequestIds(searchRequestIds: Array<number>): Promise<Map<number, number>>;

    getInteractions(
        owner: string,
        offerIds?: Array<number> | undefined,
        states?: Array<OfferResultAction> | undefined
    ): Promise<Array<OfferInteraction>>;

    complainToSearchItem(clientId: string, searchResultId: number): Promise<void>;

    rejectSearchItem(clientId: string, searchResultId: number): Promise<void>;

    evaluateSearchItem(clientId: string, searchResultId: number): Promise<void>;

    confirmSearchItem(clientId: string, searchResultId: number): Promise<void>;

    claimPurchaseForSearchItem(clientId: string, searchResultId: number): Promise<void>;

    addResultItem(clientId: string, offerSearch: OfferSearch): Promise<void>;

    addEventToOfferSearch(event: string, offerSearchId: number): Promise<void>;

    clone(owner: string, originalToCopyOfferSearchIds: Array<Pair<number, number>>): Promise<Array<OfferSearch>>;
}
