import { JsonObject } from '../../../../repository/models/JsonObject';
import { JsonDeserializer } from '../JsonDeserializer';

export class ArrayDeserializer<T> implements JsonDeserializer<Array<T>> {

    constructor(private readonly jsonDeserializer: JsonDeserializer<T>) {
    }

    public fromJson(json: JsonObject<Array<T>>): Array<T> {
        return json.map(item => this.jsonDeserializer.fromJson(item));
    }
}
