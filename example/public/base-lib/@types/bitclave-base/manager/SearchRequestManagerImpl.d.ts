import { Observable } from 'rxjs/Rx';
import Account from '../repository/models/Account';
import { SearchRequestRepository } from '../repository/search/SearchRequestRepository';
import SearchRequest from '../repository/models/SearchRequest';
import { SearchRequestManager } from './SearchRequestManager';
export declare class SearchRequestManagerImpl implements SearchRequestManager {
    private account;
    private requestRepository;
    constructor(requestRepository: SearchRequestRepository, authAccountBehavior: Observable<Account>);
    createRequest(searchRequest: SearchRequest): Promise<SearchRequest>;
    getMyRequests(id?: number): Promise<Array<SearchRequest>>;
    getAllRequests(): Promise<Array<SearchRequest>>;
    deleteRequest(id: number): Promise<number>;
    private onChangeAccount(account);
}
