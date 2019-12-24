import { JsonObject } from '../../../../repository/models/JsonObject';
import { JsonDeserializer } from '../JsonDeserializer';
export declare class SimpleMapDeserializer<T> implements JsonDeserializer<T> {
    fromJson(json: JsonObject<T>): T;
}
