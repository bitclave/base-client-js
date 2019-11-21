import { AccessRight, JsonObject } from '../../../../Base';
import { JsonDeserializer } from '../JsonDeserializer';

export class AccessRightMapDeserializer implements JsonDeserializer<Map<string, AccessRight>> {

    public fromJson(json: JsonObject<Map<string, AccessRight>>): Map<string, AccessRight> {
        // @ts-ignore
        return new Map<string, AccessRight>(Object.entries(json));
    }
}
