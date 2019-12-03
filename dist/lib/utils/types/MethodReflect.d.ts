import { JsonObject } from '../../repository/models/JsonTransform';
export declare const METHOD_PARAMS_JSON_TRANSFORM: unique symbol;
export declare const JsonTransform: <T>(jsonTransform: JsonJsonDeserializer<T>) => (target: any, propertyKey: string, index: number) => void;
export interface JsonJsonDeserializer<T> {
    fromJson(json: JsonObject<T>): T;
}
