import { SearchRequestRepository } from './SearchRequestRepository';
import SearchRequest from '../models/SearchRequest';
import { HttpTransport } from '../source/http/HttpTransport';
export default class SearchRequestRepositoryImpl implements SearchRequestRepository {
    private readonly SEARCH_REQUEST_API;
    private transport;
    constructor(transport: HttpTransport);
    create(owner: string, searchRequest: SearchRequest): Promise<SearchRequest>;
    deleteById(owner: string, id: number): Promise<number>;
    getSearchRequestByOwnerAndId(owner: string, id: number): Promise<Array<SearchRequest>>;
    getSearchRequestByOwner(owner: string): Promise<Array<SearchRequest>>;
    getAllSearchRequests(): Promise<Array<SearchRequest>>;
    private jsonToListSearchRequests;
}
