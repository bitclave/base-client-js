import { JsonObject } from '../../../../repository/models/JsonObject';
import { JsonDeserializer } from '../JsonDeserializer';
export declare class ArrayDeserializer<T> implements JsonDeserializer<Array<T>> {
    private readonly jsonDeserializer;
    constructor(jsonDeserializer: JsonDeserializer<T>);
    fromJson(json: JsonObject<Array<T>>): Array<T>;
}
