import { InputGraphData } from '../../../../repository/models/InputGraphData';
import { JsonObject } from '../../../../repository/models/JsonObject';
import { JsonDeserializer } from '../JsonDeserializer';
export declare class InputGraphDataDeserializer implements JsonDeserializer<InputGraphData> {
    fromJson(json: JsonObject<InputGraphData>): InputGraphData;
}
