import { JsonDeserializer } from './JsonDeserializer';
export declare const PARAM_JSON_DESERIALIZER: unique symbol;
export declare const ParamDeserializer: <T>(jsonTransform: JsonDeserializer<T>) => (target: object, propertyKey: string, index: number) => void;
