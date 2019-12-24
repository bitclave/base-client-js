import { JsonObject } from './JsonObject';
import { JsonTransform } from './JsonTransform';
export declare class InputGraphData extends JsonTransform {
    readonly clients: Array<string>;
    readonly fields: Set<string>;
    static fromJson(json: JsonObject<InputGraphData>): InputGraphData;
    constructor(clients: Array<string>, fields?: Set<string>);
    toJson(): object;
}
