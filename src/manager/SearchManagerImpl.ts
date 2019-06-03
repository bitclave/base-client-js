import { Observable } from 'rxjs/Rx';
import Account from '../repository/models/Account';
import OfferSearch, { OfferResultAction } from '../repository/models/OfferSearch';
import OfferSearchResultItem from '../repository/models/OfferSearchResultItem';
import { Page } from '../repository/models/Page';
import SearchRequest from '../repository/models/SearchRequest';
import { OfferSearchRepository, OfferSearchRequestInterestMode } from '../repository/search/OfferSearchRepository';
import { SearchRequestRepository } from '../repository/search/SearchRequestRepository';
import { SearchManager, SortOfferSearch } from './SearchManager';

export class SearchManagerImpl implements SearchManager {

    private account: Account = new Account();
    private requestRepository: SearchRequestRepository;
    private offerSearchRepository: OfferSearchRepository;

    constructor(
        requestRepository: SearchRequestRepository,
        offerSearchRepository: OfferSearchRepository,
        authAccountBehavior: Observable<Account>
    ) {
        this.requestRepository = requestRepository;
        this.offerSearchRepository = offerSearchRepository;

        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));
    }

    public createRequest(searchRequest: SearchRequest): Promise<SearchRequest> {
        return this.requestRepository.create(this.account.publicKey, searchRequest);
    }

    public updateRequest(searchRequest: SearchRequest): Promise<SearchRequest> {
        return this.requestRepository.update(this.account.publicKey, searchRequest.id, searchRequest);
    }

    public cloneRequest(searchRequest: SearchRequest): Promise<SearchRequest> {
        return this.requestRepository.clone(this.account.publicKey, searchRequest);
    }

    public cloneOfferSearch(id: number, searchRequest: SearchRequest): Promise<Array<OfferSearch>> {
        return this.offerSearchRepository.clone(this.account.publicKey, id, searchRequest);
    }

    public getMyRequests(id: number = 0): Promise<Array<SearchRequest>> {
        if (id > 0) {
            return this.requestRepository.getSearchRequestByOwnerAndId(this.account.publicKey, id);

        } else {
            return this.requestRepository.getSearchRequestByOwner(this.account.publicKey);
        }
    }

    public getAllRequests(): Promise<Array<SearchRequest>> {
        return this.requestRepository.getAllSearchRequests();
    }

    public deleteRequest(id: number): Promise<number> {
        return this.requestRepository.deleteById(this.account.publicKey, id);
    }

    public createSearchResultByQuery(
        query: string,
        searchRequestId: number,
        page?: number,
        size?: number,
        interests?: Array<string>,
        mode?: OfferSearchRequestInterestMode
    ): Promise<Page<OfferSearchResultItem>> {
        return this.offerSearchRepository.createByQuery(
            this.account.publicKey,
            query,
            searchRequestId,
            page,
            size,
            interests,
            mode
        );
    }

    public getCountBySearchRequestIds(searchRequestIds: Array<number>): Promise<Map<number, number>> {
        return this.offerSearchRepository.getCountBySearchRequestIds(searchRequestIds);
    }

    public getSearchResult(searchRequestId: number): Promise<Page<OfferSearchResultItem>> {
        return this.offerSearchRepository.getSearchResult(this.account.publicKey, searchRequestId);
    }

    public getUserOfferSearches(
        page: number = 0,
        size: number = 20,
        unique: boolean = false,
        searchIds: Array<number> = [],
        state: Array<OfferResultAction> = [],
        sort?: SortOfferSearch
    ): Promise<Page<OfferSearchResultItem>> {
        return this.offerSearchRepository
            .getUserOfferSearches(this.account.publicKey, page, size, unique, searchIds, state, sort);
    }

    public getSearchResultByOfferSearchId(offerSearchId: number): Promise<Page<OfferSearchResultItem>> {
        return this.offerSearchRepository.getSearchResultByOfferSearchId(this.account.publicKey, offerSearchId);
    }

    public complainToSearchItem(searchResultId: number): Promise<void> {
        return this.offerSearchRepository.complainToSearchItem(this.account.publicKey, searchResultId);
    }

    public rejectSearchItem(searchResultId: number): Promise<void> {
        return this.offerSearchRepository.rejectSearchItem(this.account.publicKey, searchResultId);
    }

    public evaluateSearchItem(searchResultId: number): Promise<void> {
        return this.offerSearchRepository.evaluateSearchItem(this.account.publicKey, searchResultId);
    }

    public confirmSearchItem(searchResultId: number): Promise<void> {
        return this.offerSearchRepository.confirmSearchItem(this.account.publicKey, searchResultId);
    }

    public claimPurchaseForSearchItem(searchResultId: number): Promise<void> {
        return this.offerSearchRepository.claimPurchaseForSearchItem(this.account.publicKey, searchResultId);
    }

    public addResultItem(offerSearch: OfferSearch): Promise<void> {
        return this.offerSearchRepository.addResultItem(this.account.publicKey, offerSearch);
    }

    public addEventToOfferSearch(event: string, offerSearchId: number): Promise<void> {
        return this.offerSearchRepository.addEventToOfferSearch(event, offerSearchId);
    }

    public getSearchRequestsByOwnerAndTag(owner: string, tag: string): Promise<Array<SearchRequest>> {
        return this.requestRepository.getSearchRequestsByOwnerAndTag(owner, tag);
    }

    public getMySearchRequestsByTag(tag: string): Promise<Array<SearchRequest>> {
        return this.requestRepository.getSearchRequestsByOwnerAndTag(this.account.publicKey, tag);
    }

    private onChangeAccount(account: Account) {
        this.account = account;
    }

}
