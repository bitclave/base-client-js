import { Observable } from 'rxjs/Rx';
import Account from '../repository/models/Account';
import { SearchRequestRepository } from '../repository/search/SearchRequestRepository';
import SearchRequest from '../repository/models/SearchRequest';
import { SearchRequestManager } from './SearchRequestManager';

export class SearchRequestManagerImpl implements SearchRequestManager {

    private account: Account = new Account();
    private requestRepository: SearchRequestRepository;

    constructor(requestRepository: SearchRequestRepository, authAccountBehavior: Observable<Account>) {
        this.requestRepository = requestRepository;

        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));
    }

    public createRequest(searchRequest: SearchRequest): Promise<SearchRequest> {
        return this.requestRepository.create(this.account.publicKey, searchRequest);
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

    private onChangeAccount(account: Account) {
        this.account = account;
    }

}
