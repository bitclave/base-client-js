import { JsonObject } from '../../../../repository/models/JsonObject';
import { Page } from '../../../../repository/models/Page';
import { JsonDeserializer } from '../JsonDeserializer';

export class PageDeserializer<T> implements JsonDeserializer<Page<T>> {

    // tslint:disable-next-line:callable-types
    constructor(private readonly Creator: { new(): T; }) {
    }

    public fromJson(json: JsonObject<Page<T>>): Page<T> {
        return Page.fromJson(json, this.Creator);
    }
}
