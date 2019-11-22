import { DataRequest } from '../../../../repository/models/DataRequest';
import { JsonObject } from '../../../../repository/models/JsonObject';
import { JsonDeserializer } from '../JsonDeserializer';

export class ArrayDataRequestDeserializer implements JsonDeserializer<Array<DataRequest>> {

    public fromJson(json: JsonObject<Array<DataRequest>>): Array<DataRequest> {
        return json.map(item => DataRequest.fromJson(item));
    }
}
