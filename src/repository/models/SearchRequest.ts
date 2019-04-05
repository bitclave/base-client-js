import { JsonUtils } from '../../utils/JsonUtils';
import { DeepCopy } from './DeepCopy';
import { JsonObject } from './JsonObject';

export default class SearchRequest extends DeepCopy<SearchRequest> {

    public readonly id: number = 0;
    public readonly owner: string = '0x0';
    public tags: Map<string, string>;
    public createdAt: Date = new Date();
    public updatedAt: Date = new Date();

    public static fromJson(json: object): SearchRequest {
        const rawData = json as JsonObject<SearchRequest>;
        const searchRequest: SearchRequest = Object.assign(new SearchRequest(), rawData);
        searchRequest.tags = JsonUtils.jsonToMap(rawData.tags as object);
        searchRequest.createdAt = new Date(rawData.createdAt as string);
        searchRequest.updatedAt = new Date(rawData.updatedAt as string);

        return searchRequest;
    }

    constructor(tags: Map<string, string> = new Map()) {
        super();
        this.tags = tags;
    }

    public toJson() {
        const jsonStr = JSON.stringify(this);
        const json = JSON.parse(jsonStr);
        json.tags = JsonUtils.mapToJson(this.tags);
        json.createdAt = this.createdAt.toJSON();
        json.updatedAt = this.updatedAt.toJSON();

        return json;
    }

    protected deepCopyFromJson(): SearchRequest {
        return SearchRequest.fromJson(this.toJson());
    }
}
