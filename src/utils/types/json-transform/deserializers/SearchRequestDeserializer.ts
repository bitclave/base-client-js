import { JsonObject } from '../../../../repository/models/JsonObject';
import SearchRequest from '../../../../repository/models/SearchRequest';
import { JsonDeserializer } from '../JsonDeserializer';

export class SearchRequestDeserializer implements JsonDeserializer<SearchRequest | Array<SearchRequest>> {

    public fromJson(json: JsonObject<SearchRequest | Array<SearchRequest>>): SearchRequest | Array<SearchRequest> {
        return (json as object).hasOwnProperty('length')
               ? (json as JsonObject<Array<SearchRequest>>).map(item => SearchRequest.fromJson(item))
               : SearchRequest.fromJson(json);
    }
}
