import SearchRequest from '../models/SearchRequest';

export interface SearchRequestRepository {

    create(owner: string, searchRequest: SearchRequest): Promise<SearchRequest>;

    deleteById(owner: string, id: number): Promise<number>;

    getSearchRequestByOwnerAndId(owner: string, id: number): Promise<Array<SearchRequest>>;

    getSearchRequestByOwner(owner: string): Promise<Array<SearchRequest>>;

    getAllSearchRequests(): Promise<Array<SearchRequest>>;

}
