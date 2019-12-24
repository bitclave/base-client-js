import { AccessRight, JsonObject } from '../../../../Base';
import { JsonDeserializer } from '../JsonDeserializer';
export declare class AccessRightMapDeserializer implements JsonDeserializer<Map<string, AccessRight>> {
    fromJson(json: JsonObject<Map<string, AccessRight>>): Map<string, AccessRight>;
}
