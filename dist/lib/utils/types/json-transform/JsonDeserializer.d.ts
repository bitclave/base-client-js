import { JsonObject } from '../../../repository/models/JsonObject';
export interface JsonDeserializer<T> {
    fromJson(json: JsonObject<T>): T;
}
