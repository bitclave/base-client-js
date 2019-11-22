import { Observable } from 'rxjs';
import Account from '../repository/models/Account';
import { OfferInteraction, OfferResultAction } from '../repository/models/OfferInteraction';
import { OfferSearch } from '../repository/models/OfferSearch';
import OfferSearchResultItem from '../repository/models/OfferSearchResultItem';
import { Page } from '../repository/models/Page';
import { Pair } from '../repository/models/Pair';
import SearchRequest from '../repository/models/SearchRequest';
import { OfferSearchRepository, OfferSearchRequestInterestMode } from '../repository/search/OfferSearchRepository';
import { SearchRequestRepository } from '../repository/search/SearchRequestRepository';
import { ExportMethod } from '../utils/ExportMethod';
import { ParamDeserializer } from '../utils/types/json-transform';
import { SearchRequestDeserializer } from '../utils/types/json-transform/deserializers/SearchRequestDeserializer';
import { SimpleMapDeserializer } from '../utils/types/json-transform/deserializers/SimpleMapDeserializer';
import { SearchManager, SortOfferSearch } from './SearchManager';

export class SearchManagerImpl implements SearchManager {

    private account: Account = new Account();

    constructor(
        private readonly requestRepository: SearchRequestRepository,
        private readonly offerSearchRepository: OfferSearchRepository,
        authAccountBehavior: Observable<Account>
    ) {
        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));
    }

    @ExportMethod()
    public createRequest(@ParamDeserializer(SearchRequest) searchRequest: SearchRequest): Promise<SearchRequest> {
        return this.requestRepository.create(this.account.publicKey, searchRequest);
    }

    @ExportMethod()
    public updateRequest(
        @ParamDeserializer(new SearchRequestDeserializer()) searchRequest: SearchRequest | Array<SearchRequest>
    ): Promise<SearchRequest | Array<SearchRequest>> {
        if (searchRequest instanceof Array) {
            return this.requestRepository.updateBatch(this.account.publicKey, searchRequest);
        } else {
            return this.requestRepository.update(this.account.publicKey, searchRequest.id, searchRequest);
        }
    }

    @ExportMethod()
    public cloneRequest(searchRequestIds: Array<number>): Promise<Array<SearchRequest>> {
        return this.requestRepository.clone(this.account.publicKey, searchRequestIds);
    }

    @ExportMethod()
    public cloneOfferSearch(originToCopySearchRequestIds: Array<Pair<number, number>>): Promise<Array<OfferSearch>> {
        return this.offerSearchRepository.clone(this.account.publicKey, originToCopySearchRequestIds);
    }

    @ExportMethod()
    public getMyRequests(id?: number): Promise<Array<SearchRequest>> {
        if (id && id > 0) {
            return this.requestRepository.getSearchRequestByOwnerAndId(this.account.publicKey, id);

        } else {
            return this.requestRepository.getSearchRequestByOwner(this.account.publicKey);
        }
    }

    @ExportMethod()
    public getRequestsByOwnerAndId(owner: string, id?: number): Promise<Array<SearchRequest>> {
        if (id && id > 0) {
            return this.requestRepository.getSearchRequestByOwnerAndId(owner, id);

        } else {
            return this.requestRepository.getSearchRequestByOwner(owner);
        }
    }

    @ExportMethod()
    public getRequestsByPage(page?: number, size?: number): Promise<Page<SearchRequest>> {
        return this.requestRepository.getSearchRequestByPage(page, size);
    }

    @ExportMethod()
    public deleteRequest(id: number): Promise<number> {
        return this.requestRepository.deleteById(this.account.publicKey, id);
    }

    @ExportMethod()
    public getSuggestionByQuery(query: string, size?: number): Promise<Array<string>> {
        return this.offerSearchRepository.getSuggestionByQuery(query, size);
    }

    @ExportMethod()
    public createSearchResultByQuery(
        query: string,
        searchRequestId: number,
        page?: number,
        size?: number,
        interests?: Array<string>,
        mode?: OfferSearchRequestInterestMode,
        @ParamDeserializer(new SimpleMapDeserializer()) filters?: Map<string, Array<string>>
    ): Promise<Page<OfferSearchResultItem>> {
        return this.offerSearchRepository.createByQuery(
            this.account.publicKey,
            query,
            searchRequestId,
            page,
            size,
            interests,
            mode,
            filters
        );
    }

    @ExportMethod()
    public getCountBySearchRequestIds(searchRequestIds: Array<number>): Promise<Map<number, number>> {
        return this.offerSearchRepository.getCountBySearchRequestIds(searchRequestIds);
    }

    @ExportMethod()
    public getSearchResult(
        searchRequestId: number,
        page?: number,
        size?: number
    ): Promise<Page<OfferSearchResultItem>> {
        return this.offerSearchRepository.getSearchResult(this.account.publicKey, searchRequestId, page, size);
    }

    @ExportMethod()
    public getUserOfferSearches(
        page: number = 0,
        size: number = 20,
        unique: boolean = false,
        searchIds: Array<number> = [],
        state: Array<OfferResultAction> = [],
        sort?: SortOfferSearch,
        interaction?: boolean
    ): Promise<Page<OfferSearchResultItem>> {
        return this.offerSearchRepository
            .getUserOfferSearches(this.account.publicKey, page, size, unique, searchIds, state, sort, interaction);
    }

    @ExportMethod()
    public getInteractions(
        offerIds?: Array<number> | undefined,
        states?: Array<OfferResultAction> | undefined,
        owner?: string | undefined
    ): Promise<Array<OfferInteraction>> {
        return this.offerSearchRepository.getInteractions(owner ? owner : this.account.publicKey, offerIds, states);
    }

    @ExportMethod()
    public getSearchResultByOfferSearchId(
        offerSearchId: number,
        page?: number,
        size?: number
    ): Promise<Page<OfferSearchResultItem>> {
        return this.offerSearchRepository.getSearchResultByOfferSearchId(
            this.account.publicKey,
            offerSearchId,
            page,
            size
        );
    }

    @ExportMethod()
    public complainToSearchItem(searchResultId: number): Promise<void> {
        return this.offerSearchRepository.complainToSearchItem(this.account.publicKey, searchResultId);
    }

    @ExportMethod()
    public rejectSearchItem(searchResultId: number): Promise<void> {
        return this.offerSearchRepository.rejectSearchItem(this.account.publicKey, searchResultId);
    }

    @ExportMethod()
    public evaluateSearchItem(searchResultId: number): Promise<void> {
        return this.offerSearchRepository.evaluateSearchItem(this.account.publicKey, searchResultId);
    }

    @ExportMethod()
    public confirmSearchItem(searchResultId: number): Promise<void> {
        return this.offerSearchRepository.confirmSearchItem(this.account.publicKey, searchResultId);
    }

    @ExportMethod()
    public claimPurchaseForSearchItem(searchResultId: number): Promise<void> {
        return this.offerSearchRepository.claimPurchaseForSearchItem(this.account.publicKey, searchResultId);
    }

    @ExportMethod()
    public addResultItem(@ParamDeserializer(OfferSearch) offerSearch: OfferSearch): Promise<void> {
        return this.offerSearchRepository.addResultItem(this.account.publicKey, offerSearch);
    }

    @ExportMethod()
    public addEventToOfferSearch(event: string, offerSearchId: number): Promise<void> {
        return this.offerSearchRepository.addEventToOfferSearch(event, offerSearchId);
    }

    @ExportMethod()
    public getSearchRequestsByOwnerAndTag(owner: string, tag: string): Promise<Array<SearchRequest>> {
        return this.requestRepository.getSearchRequestsByOwnerAndTag(owner, tag);
    }

    @ExportMethod()
    public getMySearchRequestsByTag(tag: string): Promise<Array<SearchRequest>> {
        return this.requestRepository.getSearchRequestsByOwnerAndTag(this.account.publicKey, tag);
    }

    private onChangeAccount(account: Account) {
        this.account = account;
    }
}
