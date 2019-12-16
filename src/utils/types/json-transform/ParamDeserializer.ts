import { JsonDeserializer } from './JsonDeserializer';

export const PARAM_JSON_DESERIALIZER = Symbol('PARAM_JSON_DESERIALIZER');

export const ParamDeserializer = <T>(jsonTransform: JsonDeserializer<T>) => (
    target: object,
    propertyKey: string,
    index: number
) => {
    const jsonTo: Map<number, JsonDeserializer<T>> = (Reflect.getMetadata(
        PARAM_JSON_DESERIALIZER,
        target,
        propertyKey
    ) || new Map());

    jsonTo.set(index, jsonTransform);

    Reflect.defineMetadata(PARAM_JSON_DESERIALIZER, jsonTo, target, propertyKey);
};
