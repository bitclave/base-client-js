import SearchRequest from '../repository/models/SearchRequest';
export interface SearchRequestManager {
    createRequest(searchRequest: SearchRequest): Promise<SearchRequest>;
    getMyRequests(id: number): Promise<Array<SearchRequest>>;
    getAllRequests(): Promise<Array<SearchRequest>>;
    deleteRequest(id: number): Promise<number>;
}
