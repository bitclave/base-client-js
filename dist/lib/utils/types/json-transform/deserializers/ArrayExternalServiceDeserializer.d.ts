import { JsonObject } from '../../../../repository/models/JsonObject';
import { ExternalService } from '../../../../repository/models/services/ExternalService';
import { JsonDeserializer } from '../JsonDeserializer';
export declare class ArrayExternalServiceDeserializer implements JsonDeserializer<Array<ExternalService>> {
    fromJson(json: JsonObject<Array<ExternalService>>): Array<ExternalService>;
}
