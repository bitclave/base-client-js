import { JsonObject } from './JsonObject';

export enum LinkType {
    SHARE = 'SHARE',
    RESHARE = 'RESHARE'
}

export class GraphLink {

    public readonly from: number;
    public readonly to: number;
    public readonly key: string;
    public readonly type: LinkType;

    public static fromJson(json: JsonObject<GraphLink>): GraphLink {
        return new GraphLink(json.from as number, json.to as number, json.key as string, LinkType[json.type as string]);
    }

    constructor(from: number, to: number, key: string, type: LinkType) {
        this.from = from || 0;
        this.to = to || 0;
        this.key = key || '';
        this.type = type || LinkType.SHARE;
    }
}

export class OutputGraphData {

    public readonly clients: Set<string>;
    public readonly links: Array<GraphLink>;

    public static fromJson(json: JsonObject<OutputGraphData>): OutputGraphData {
        const links = (json.links as Array<JsonObject<GraphLink>>)
            .map(item => GraphLink.fromJson(item));

        const clients = new Set(json.clients as Array<string>);

        return new OutputGraphData(clients, links);
    }

    constructor(clients: Set<string>, links: Array<GraphLink>) {
        this.clients = clients || new Set<string>();
        this.links = links || [];
    }
}
