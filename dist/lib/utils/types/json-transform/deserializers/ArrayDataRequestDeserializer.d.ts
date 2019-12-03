import { DataRequest } from '../../../../repository/models/DataRequest';
import { JsonObject } from '../../../../repository/models/JsonObject';
import { JsonDeserializer } from '../JsonDeserializer';
export declare class ArrayDataRequestDeserializer implements JsonDeserializer<Array<DataRequest>> {
    fromJson(json: JsonObject<Array<DataRequest>>): Array<DataRequest>;
}
