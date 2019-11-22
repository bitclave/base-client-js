import { JsonObject } from '../../../../repository/models/JsonObject';
import { JsonUtils } from '../../../JsonUtils';
import { JsonDeserializer } from '../JsonDeserializer';

export class SimpleMapDeserializer implements JsonDeserializer<Map<string, string>> {

    public fromJson(json: JsonObject<Map<string, string>>): Map<string, string> {
        return JsonUtils.jsonToMap(json);
    }
}
