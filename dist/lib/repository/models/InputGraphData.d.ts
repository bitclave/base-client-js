import { JsonTransform } from './JsonTransform';
export declare class InputGraphData extends JsonTransform {
    readonly clients: Array<string>;
    readonly fields: Set<string>;
    constructor(clients: Array<string>, fields?: Set<string>);
    toJson(): object;
}
