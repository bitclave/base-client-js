import { JsonObject } from '../../../../repository/models/JsonObject';
import { ExternalService } from '../../../../repository/models/services/ExternalService';
import { JsonDeserializer } from '../JsonDeserializer';

export class ArrayExternalServiceDeserializer implements JsonDeserializer<Array<ExternalService>> {

    public fromJson(json: JsonObject<Array<ExternalService>>): Array<ExternalService> {
        return json.map(item => ExternalService.fromJson(item));
    }
}
