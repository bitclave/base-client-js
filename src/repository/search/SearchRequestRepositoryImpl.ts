import { SearchRequestRepository } from './SearchRequestRepository';
import SearchRequest from '../models/SearchRequest';
import { HttpMethod } from '../source/http/HttpMethod';
import { HttpTransport } from '../source/http/HttpTransport';

export default class SearchRequestRepositoryImpl implements SearchRequestRepository {

    private readonly SEARCH_REQUEST_API: string = '/v1/client/{owner}/search/request/{id}';
    private readonly SEARCH_BY_QUERY_REQUEST_API: string = '/v1/client/{owner}/search/request/{id}/query/';

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    public create(owner: string, searchRequest: SearchRequest): Promise<SearchRequest> {
        return this.transport.sendRequest(
            this.SEARCH_REQUEST_API.replace('{owner}', owner).replace('{id}', ''),
            HttpMethod.Post,
            searchRequest.toJson()
        ).then((response) => SearchRequest.fromJson(response.json));
    }

    public createByQuery(owner: string, query: string, searchRequestId: number): Promise<SearchRequest> {
        return this.transport.sendRequest(
            this.SEARCH_BY_QUERY_REQUEST_API
                .replace('{owner}', owner)
                .replace('{id}', searchRequestId.toString()),
            HttpMethod.Post,
            query
        ).then((response) => SearchRequest.fromJson(response.json));
    }

    public update(owner: string, id: number, searchRequest: SearchRequest): Promise<SearchRequest> {
        return this.transport.sendRequest(
            this.SEARCH_REQUEST_API.replace('{owner}', owner).replace('{id}', id.toString()),
            HttpMethod.Post,
            searchRequest.toJson()
        ).then((response) => SearchRequest.fromJson(response.json));
    }

    public clone(owner: string, searchRequest: SearchRequest): Promise<SearchRequest> {
        return this.transport.sendRequest(
            this.SEARCH_REQUEST_API.replace('{owner}', owner).replace('{id}', ''),
            HttpMethod.Put,
            searchRequest.toJson()
        ).then((response) => SearchRequest.fromJson(response.json));
    }

    public deleteById(owner: string, id: number): Promise<number> {
        return this.transport.sendRequest(
            this.SEARCH_REQUEST_API.replace('{owner}', owner).replace('{id}', id.toString()),
            HttpMethod.Delete,
            id,
        ).then((response) => parseInt(response.json.toString(), 10));
    }

    public getSearchRequestByOwnerAndId(owner: string, id: number): Promise<Array<SearchRequest>> {
        return this.transport.sendRequest(
            this.SEARCH_REQUEST_API.replace('{owner}', owner).replace('{id}', id.toString()),
            HttpMethod.Get
        ).then((response) => this.jsonToListSearchRequests(response.json));
    }

    public getSearchRequestByOwner(owner: string): Promise<Array<SearchRequest>> {
        return this.transport.sendRequest(
            this.SEARCH_REQUEST_API.replace('{owner}', owner).replace('{id}', ''),
            HttpMethod.Get
        ).then((response) => this.jsonToListSearchRequests(response.json));
    }

    public getAllSearchRequests(): Promise<Array<SearchRequest>> {
        return this.transport.sendRequest(
            this.SEARCH_REQUEST_API.replace('{owner}', '0x0').replace('{id}', ''),
            HttpMethod.Get
        ).then((response) => this.jsonToListSearchRequests(response.json));
    }

    public getSearchRequestsByOwnerAndTag(owner: string, tag: string): Promise<Array<SearchRequest>> {
        return this.transport.sendRequest(
            this.SEARCH_REQUEST_API.replace('{owner}', owner).replace('{id}', 'tag/' + tag),
            HttpMethod.Get
        ).then((response) => this.jsonToListSearchRequests(response.json));
    }

    private jsonToListSearchRequests(json: any): Array<SearchRequest> {
        const result: Array<SearchRequest> = [];

        for (let item of json) {
            result.push(SearchRequest.fromJson(item));
        }

        return result;
    }

}
