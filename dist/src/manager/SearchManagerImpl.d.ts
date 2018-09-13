import { Observable } from 'rxjs/Rx';
import Account from '../repository/models/Account';
import { SearchRequestRepository } from '../repository/search/SearchRequestRepository';
import SearchRequest from '../repository/models/SearchRequest';
import { SearchManager } from './SearchManager';
import OfferSearchResultItem from '../repository/models/OfferSearchResultItem';
import OfferSearch from '../repository/models/OfferSearch';
import { OfferSearchRepository } from '../repository/search/OfferSearchRepository';
export declare class SearchManagerImpl implements SearchManager {
    private account;
    private requestRepository;
    private offerSearchRepository;
    constructor(requestRepository: SearchRequestRepository, offerSearchRepository: OfferSearchRepository, authAccountBehavior: Observable<Account>);
    createRequest(searchRequest: SearchRequest): Promise<SearchRequest>;
    getMyRequests(id?: number): Promise<Array<SearchRequest>>;
    getAllRequests(): Promise<Array<SearchRequest>>;
    deleteRequest(id: number): Promise<number>;
    getSearchResult(searchRequestId: number): Promise<Array<OfferSearchResultItem>>;
    complainToSearchItem(searchResultId: number): Promise<void>;
    addResultItem(offerSearch: OfferSearch): Promise<void>;
    private onChangeAccount;
}
