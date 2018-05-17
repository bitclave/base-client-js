import OfferSearchResultItem from '../models/OfferSearchResultItem';
import OfferSearch from '../models/OfferSearch';

export interface OfferSearchRepository {

    getSearchResult(clientId: string, searchRequestId: number): Promise<Array<OfferSearchResultItem>>

    complainToSearchItem(clientId: string, searchResultId: number): Promise<void>

    // debug method! do not use!
    addResultItem(clientId: string, offerSearch: OfferSearch): Promise<void>

}
