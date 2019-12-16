import { JsonObject } from '../../../../repository/models/JsonObject';
import { JsonUtils } from '../../../JsonUtils';
import { JsonDeserializer } from '../JsonDeserializer';

export class SimpleMapDeserializer<T> implements JsonDeserializer<T> {

    public fromJson(json: JsonObject<T>): T {
        /* tslint:disable-next-line:no-any */
        return JsonUtils.jsonToMap(json) as any;
    }
}
