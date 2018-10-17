import { OfferSearchRepository } from './OfferSearchRepository';
import OfferSearchResultItem from '../models/OfferSearchResultItem';
import OfferSearch from '../models/OfferSearch';
import { HttpTransport } from '../source/http/HttpTransport';
export declare class OfferSearchRepositoryImpl implements OfferSearchRepository {
    private readonly OFFER_SEARCH_API;
    private readonly OFFER_SEARCH_ADD_API;
    private transport;
    constructor(transport: HttpTransport);
    getSearchResult(clientId: string, searchRequestId: number): Promise<Array<OfferSearchResultItem>>;
    complainToSearchItem(clientId: string, searchResultId: number): Promise<any>;
    addResultItem(clientId: string, offerSearch: OfferSearch): Promise<any>;
    private jsonToListResult;
}
