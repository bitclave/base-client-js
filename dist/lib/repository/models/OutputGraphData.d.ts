import { JsonObject } from './JsonObject';
import { JsonTransform } from './JsonTransform';
export declare enum LinkType {
    SHARE = "SHARE",
    RESHARE = "RESHARE"
}
export declare class GraphLink extends JsonTransform {
    readonly from: number;
    readonly to: number;
    readonly key: string;
    readonly type: LinkType;
    static fromJson(json: JsonObject<GraphLink>): GraphLink;
    constructor(from: number, to: number, key: string, type: LinkType);
    toJson(): object;
}
export declare class OutputGraphData extends JsonTransform {
    readonly clients: Set<string>;
    readonly links: Array<GraphLink>;
    static fromJson(json: JsonObject<OutputGraphData>): OutputGraphData;
    constructor(clients: Set<string>, links: Array<GraphLink>);
    toJson(): object;
}
