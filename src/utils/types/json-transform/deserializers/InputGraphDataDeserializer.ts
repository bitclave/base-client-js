import { InputGraphData } from '../../../../repository/models/InputGraphData';
import { JsonObject } from '../../../../repository/models/JsonObject';
import { JsonDeserializer } from '../JsonDeserializer';

export class InputGraphDataDeserializer implements JsonDeserializer<InputGraphData> {

    public fromJson(json: JsonObject<InputGraphData>): InputGraphData {
        return new InputGraphData(
            json.clients,
            json.fields ? new Set<string>(json.fields) : json.fields
        );
    }
}
