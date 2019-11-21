import { AccessRight, JsonObject } from '../../../../Base';
import { JsonDeserializer } from '../JsonDeserializer';

export class AccessRightMapDeserializer implements JsonDeserializer<Map<string, AccessRight>> {

    public fromJson(json: JsonObject<Map<string, AccessRight>>): Map<string, AccessRight> {
        // @ts-ignore
        const result = new Map<string, AccessRight>(Object.entries(json));
        result.forEach((value: number, key: object) => result.set(key, value));

        return result;
    }
}
