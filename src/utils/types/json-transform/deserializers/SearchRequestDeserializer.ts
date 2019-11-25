import { JsonObject } from '../../../../repository/models/JsonObject';
import SearchRequest from '../../../../repository/models/SearchRequest';
import { JsonDeserializer } from '../JsonDeserializer';
import { ArrayDeserializer } from './ArrayDeserializer';

export class SearchRequestDeserializer implements JsonDeserializer<SearchRequest | Array<SearchRequest>> {

    private readonly arrayDeserializer = new ArrayDeserializer(SearchRequest);

    public fromJson(json: JsonObject<SearchRequest | Array<SearchRequest>>): SearchRequest | Array<SearchRequest> {
        return (json as object).hasOwnProperty('length')
               ? this.arrayDeserializer.fromJson(json as JsonObject<Array<SearchRequest>>)
               : SearchRequest.fromJson(json);
    }
}
