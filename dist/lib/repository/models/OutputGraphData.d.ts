import { JsonObject } from './JsonObject';
export declare enum LinkType {
    SHARE = "SHARE",
    RESHARE = "RESHARE"
}
export declare class GraphLink {
    readonly from: number;
    readonly to: number;
    readonly key: string;
    readonly type: LinkType;
    static fromJson(json: JsonObject<GraphLink>): GraphLink;
    constructor(from: number, to: number, key: string, type: LinkType);
}
export declare class OutputGraphData {
    readonly clients: Set<string>;
    readonly links: Array<GraphLink>;
    static fromJson(json: JsonObject<OutputGraphData>): OutputGraphData;
    constructor(clients: Set<string>, links: Array<GraphLink>);
}
