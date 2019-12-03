import { JsonObject } from '../../../../repository/models/JsonObject';
import { JsonTransform } from '../../../../repository/models/JsonTransform';
import { Page } from '../../../../repository/models/Page';
import { JsonDeserializer } from '../JsonDeserializer';
export declare class PageDeserializer<T extends JsonTransform> implements JsonDeserializer<Page<T>> {
    private readonly creator;
    constructor(creator: JsonDeserializer<T>);
    fromJson(json: JsonObject<Page<T>>): Page<T>;
}
