import { JsonObject } from '../models/JsonObject';
import { Page } from '../models/Page';
import SearchRequest from '../models/SearchRequest';
import { HttpMethod } from '../source/http/HttpMethod';
import { HttpTransport } from '../source/http/HttpTransport';
import { SearchRequestRepository } from './SearchRequestRepository';

export default class SearchRequestRepositoryImpl implements SearchRequestRepository {

    private readonly SEARCH_REQUEST_API: string = '/v1/client/{owner}/search/request/{id}';
    private readonly SEARCH_REQUEST_API_V2: string = '/v2/client/{owner}/search/request/{id}';
    private readonly SEARCH_REQUEST_PAGEABLE_API: string = '/v1/search/requests?page={page}&size={size}';

    constructor(private readonly transport: HttpTransport) {
    }

    public create(owner: string, searchRequest: SearchRequest): Promise<SearchRequest> {
        return this.transport.sendRequest(
            this.SEARCH_REQUEST_API.replace('{owner}', owner).replace('{id}', ''),
            HttpMethod.Post,
            searchRequest.toJson()
        ).then((response) => SearchRequest.fromJson(response.json));
    }

    public update(owner: string, id: number, searchRequest: SearchRequest): Promise<SearchRequest> {
        return this.transport.sendRequest(
            this.SEARCH_REQUEST_API.replace('{owner}', owner).replace('{id}', id.toString()),
            HttpMethod.Post,
            searchRequest.toJson()
        ).then((response) => SearchRequest.fromJson(response.json));
    }

    public updateBatch(owner: string, searchRequests: Array<SearchRequest>): Promise<Array<SearchRequest>> {
        const body = searchRequests.map(item => item.toJson());

        return this.transport.sendRequest<Array<SearchRequest>>(
            this.SEARCH_REQUEST_API_V2.replace('{owner}', owner).replace('/{id}', ''),
            HttpMethod.Post,
            body
        ).then((response) => this.jsonToListSearchRequests(response.json));
    }

    public clone(owner: string, searchRequestIds: Array<number>): Promise<Array<SearchRequest>> {
        return this.transport.sendRequest<Array<SearchRequest>>(
            this.SEARCH_REQUEST_API_V2.replace('{owner}', owner).replace('{id}', ''),
            HttpMethod.Put,
            searchRequestIds
        ).then((response) => this.jsonToListSearchRequests(response.json));
    }

    public deleteById(owner: string, id: number): Promise<number> {
        return this.transport.sendRequest(
            this.SEARCH_REQUEST_API.replace('{owner}', owner).replace('{id}', id.toString()),
            HttpMethod.Delete,
            id,
        ).then(response => parseInt(response.json.toString(), 10));
    }

    public getSearchRequestByOwnerAndId(owner: string, id: number): Promise<Array<SearchRequest>> {
        return this.transport.sendRequest<Array<SearchRequest>>(
            this.SEARCH_REQUEST_API.replace('{owner}', owner).replace('{id}', id.toString()),
            HttpMethod.Get
        ).then((response) => this.jsonToListSearchRequests(response.json));
    }

    public getSearchRequestByOwner(owner: string): Promise<Array<SearchRequest>> {
        return this.transport.sendRequest<Array<SearchRequest>>(
            this.SEARCH_REQUEST_API.replace('{owner}', owner).replace('{id}', ''),
            HttpMethod.Get
        ).then((response) => this.jsonToListSearchRequests(response.json));
    }

    public getSearchRequestsByOwnerAndTag(owner: string, tag: string): Promise<Array<SearchRequest>> {
        return this.transport.sendRequest<Array<SearchRequest>>(
            this.SEARCH_REQUEST_API.replace('{owner}', owner).replace('{id}', 'tag/' + tag),
            HttpMethod.Get
        ).then((response) => this.jsonToListSearchRequests(response.json));
    }

    public getSearchRequestByPage(page?: number, size?: number): Promise<Page<SearchRequest>> {
        return this.transport.sendRequest<Page<SearchRequest>>(
            this.SEARCH_REQUEST_PAGEABLE_API
                .replace('{page}', (page || 0).toString())
                .replace('{size}', (size || 20).toString()),
            HttpMethod.Get
        ).then((response) => Page.fromJson(response.json, SearchRequest));
    }

    private jsonToListSearchRequests(json: JsonObject<Array<SearchRequest>>): Array<SearchRequest> {
        return Object.keys(json).map(key => SearchRequest.fromJson(json[key] as object));
    }
}
