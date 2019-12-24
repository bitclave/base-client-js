import { Page } from '../models/Page';
import SearchRequest from '../models/SearchRequest';
import { HttpTransport } from '../source/http/HttpTransport';
import { SearchRequestRepository } from './SearchRequestRepository';
export default class SearchRequestRepositoryImpl implements SearchRequestRepository {
    private readonly transport;
    private readonly SEARCH_REQUEST_API;
    private readonly SEARCH_REQUEST_API_V2;
    private readonly SEARCH_REQUEST_PAGEABLE_API;
    constructor(transport: HttpTransport);
    create(owner: string, searchRequest: SearchRequest): Promise<SearchRequest>;
    update(owner: string, id: number, searchRequest: SearchRequest): Promise<SearchRequest>;
    updateBatch(owner: string, searchRequests: Array<SearchRequest>): Promise<Array<SearchRequest>>;
    clone(owner: string, searchRequestIds: Array<number>): Promise<Array<SearchRequest>>;
    deleteById(owner: string, id: number): Promise<number>;
    getSearchRequestByOwnerAndId(owner: string, id: number): Promise<Array<SearchRequest>>;
    getSearchRequestByOwner(owner: string): Promise<Array<SearchRequest>>;
    getSearchRequestsByOwnerAndTag(owner: string, tag: string): Promise<Array<SearchRequest>>;
    getSearchRequestByPage(page?: number, size?: number): Promise<Page<SearchRequest>>;
    private jsonToListSearchRequests;
}
