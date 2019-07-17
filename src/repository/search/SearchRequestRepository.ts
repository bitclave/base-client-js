import { Page } from '../models/Page';
import SearchRequest from '../models/SearchRequest';

export interface SearchRequestRepository {

    create(owner: string, searchRequest: SearchRequest): Promise<SearchRequest>;

    update(owner: string, id: number, searchRequest: SearchRequest): Promise<SearchRequest>;

    updateBatch(owner: string, searchRequests: Array<SearchRequest>): Promise<Array<SearchRequest>>;

    clone(owner: string, searchRequestIds: Array<number>): Promise<Array<SearchRequest>>;

    deleteById(owner: string, id: number): Promise<number>;

    getSearchRequestByOwnerAndId(owner: string, id: number): Promise<Array<SearchRequest>>;

    getSearchRequestByOwner(owner: string): Promise<Array<SearchRequest>>;

    getSearchRequestsByOwnerAndTag(owner: string, tag: string): Promise<Array<SearchRequest>>;

    getSearchRequestByPage(page?: number, size?: number): Promise<Page<SearchRequest>>;
}
