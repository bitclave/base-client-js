import { JsonObject } from '../../../../repository/models/JsonObject';
import SearchRequest from '../../../../repository/models/SearchRequest';
import { JsonDeserializer } from '../JsonDeserializer';
export declare class SearchRequestDeserializer implements JsonDeserializer<SearchRequest | Array<SearchRequest>> {
    private readonly arrayDeserializer;
    fromJson(json: JsonObject<SearchRequest | Array<SearchRequest>>): SearchRequest | Array<SearchRequest>;
}
