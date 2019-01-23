import OfferSearchResultItem from '../models/OfferSearchResultItem';
import OfferSearch from '../models/OfferSearch';

export interface OfferSearchRepository {
    getSearchResult(clientId: string, searchRequestId: number): Promise<Array<OfferSearchResultItem>>;
    getSearchResultByOfferSearchId(clientId: string, offerSearchId: number): Promise<Array<OfferSearchResultItem>>;
    complainToSearchItem(clientId: string, searchResultId: number): Promise<void>;
    rejectSearchItem(clientId: string, searchResultId: number): Promise<void>;
    evaluateSearchItem(clientId: string, searchResultId: number): Promise<void>;
    confirmSearchItem(clientId: string, searchResultId: number): Promise<void>;
    addResultItem(clientId: string, offerSearch: OfferSearch): Promise<void>;
    addEventToOfferSearch(event: string, offerSearchId: number): Promise<void>;

}
