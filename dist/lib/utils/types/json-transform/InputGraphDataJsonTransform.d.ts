import { InputGraphData } from '../../../repository/models/InputGraphData';
import { JsonObject } from '../../../repository/models/JsonTransform';
import { JsonPipeTransform } from '../MethodReflect';
export declare class InputGraphDataJsonTransform implements JsonPipeTransform<InputGraphData> {
    transform(json: JsonObject<InputGraphData>): InputGraphData;
}
