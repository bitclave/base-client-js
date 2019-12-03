import { JsonObject } from '../../repository/models/JsonObject';
export declare const METHOD_PARAMS_JSON_TRANSFORM: unique symbol;
export declare const JsonTransform: <T>(jsonTransform: JsonDeserializer<T>) => (target: any, propertyKey: string, index: number) => void;
export interface JsonDeserializer<T> {
    fromJson(json: JsonObject<T>): T;
}
