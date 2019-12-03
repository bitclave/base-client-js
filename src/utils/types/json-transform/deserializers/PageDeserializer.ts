import { JsonObject } from '../../../../repository/models/JsonObject';
import { JsonTransform } from '../../../../repository/models/JsonTransform';
import { Page } from '../../../../repository/models/Page';
import { JsonDeserializer } from '../JsonDeserializer';

export class PageDeserializer<T extends JsonTransform> implements JsonDeserializer<Page<T>> {

    constructor(private readonly creator: JsonDeserializer<T>) {
    }

    public fromJson(json: JsonObject<Page<T>>): Page<T> {
        return Page.fromJson(json, this.creator);
    }
}
