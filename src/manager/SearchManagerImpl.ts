import { Observable } from 'rxjs/Rx';
import Account from '../repository/models/Account';
import { SearchRequestRepository } from '../repository/search/SearchRequestRepository';
import SearchRequest from '../repository/models/SearchRequest';
import { SearchManager } from './SearchManager';
import OfferSearchResultItem from '../repository/models/OfferSearchResultItem';
import OfferSearch from '../repository/models/OfferSearch';
import { OfferSearchRepository } from '../repository/search/OfferSearchRepository';

export class SearchManagerImpl implements SearchManager {

    private account: Account = new Account();
    private requestRepository: SearchRequestRepository;
    private offerSearchRepository: OfferSearchRepository;

    constructor(requestRepository: SearchRequestRepository,
                offerSearchRepository: OfferSearchRepository,
                authAccountBehavior: Observable<Account>) {
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

    public cloneOfferSearch(id: number, searchRequest: SearchRequest): Promise<OfferSearch[]> {
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

    public getSearchResult(searchRequestId: number): Promise<Array<OfferSearchResultItem>> {
        return this.offerSearchRepository.getSearchResult(this.account.publicKey, searchRequestId);
    }

    public getUserOfferSearches(): Promise<Array<OfferSearchResultItem>> {
        return this.offerSearchRepository.getUserOfferSearches(this.account.publicKey);
    }

    public getSearchResultByOfferSearchId(offerSearchId: number): Promise<Array<OfferSearchResultItem>> {
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

    private onChangeAccount(account: Account) {
        this.account = account;
    }

    public getSearchRequestsByOwnerAndTag(owner: string, tag: string): Promise<Array<SearchRequest>> {
        return this.requestRepository.getSearchRequestsByOwnerAndTag(owner, tag);
    }

    public getMySearchRequestsByTag(tag: string): Promise<Array<SearchRequest>> {
        return this.requestRepository.getSearchRequestsByOwnerAndTag(this.account.publicKey, tag);
    }

}
