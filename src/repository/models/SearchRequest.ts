import { JsonUtils } from '../../utils/JsonUtils';

export default class SearchRequest {

    readonly id: number = 0;
    readonly owner: string = '0x0';
    tags: Map<String, String>;

    public static fromJson(json: any): SearchRequest {
        const searchRequest: SearchRequest = Object.assign(new SearchRequest(), json);
        searchRequest.tags = JsonUtils.jsonToMap(json['tags']);

        return searchRequest;
    }

    constructor(tags: Map<String, String> = new Map()) {
        this.tags = tags;
    }

    public toJson(): any {
        const jsonStr = JSON.stringify(this);
        const json = JSON.parse(jsonStr);
        json['tags'] = JsonUtils.mapToJson(this.tags);

        return json;
    }

}