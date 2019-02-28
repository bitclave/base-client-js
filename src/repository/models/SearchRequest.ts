import { JsonUtils } from '../../utils/JsonUtils';

export default class SearchRequest {

    readonly id: number = 0;
    readonly owner: string = '0x0';
    tags: Map<String, String>;
    createdAt: Date = new Date();
    updatedAt: Date = new Date();

    public static fromJson(json: any): SearchRequest {
        const searchRequest: SearchRequest = Object.assign(new SearchRequest(), json);
        searchRequest.tags = JsonUtils.jsonToMap(json.tags);
        searchRequest.createdAt = new Date(json.createdAt);
        searchRequest.updatedAt = new Date(json.updatedAt);

        return searchRequest;
    }

    constructor(tags: Map<String, String> = new Map()) {
        this.tags = tags;
    }

    public toJson() {
        const jsonStr = JSON.stringify(this);
        const json = JSON.parse(jsonStr);
        json.tags = JsonUtils.mapToJson(this.tags);
        json.createdAt = this.createdAt.toUTCString();
        json.updatedAt = this.updatedAt.toUTCString();

        return json;
    }

}
