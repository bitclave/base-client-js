import { JsonObject } from './JsonObject';
import { JsonTransform } from './JsonTransform';

export enum LinkType {
    SHARE = 'SHARE',
    RESHARE = 'RESHARE'
}

export class GraphLink extends JsonTransform {

    public readonly from: number;
    public readonly to: number;
    public readonly key: string;
    public readonly type: LinkType;

    public static fromJson(json: JsonObject<GraphLink>): GraphLink {
        return new GraphLink(json.from as number, json.to as number, json.key as string, LinkType[json.type as string]);
    }

    constructor(from: number, to: number, key: string, type: LinkType) {
        super();

        this.from = from || 0;
        this.to = to || 0;
        this.key = key || '';
        this.type = type || LinkType.SHARE;
    }

    public toJson(): object {
        return this;
    }
}

export class OutputGraphData extends JsonTransform {

    public readonly clients: Set<string>;
    public readonly links: Array<GraphLink>;

    public static fromJson(json: JsonObject<OutputGraphData>): OutputGraphData {
        const links = (json.links as Array<JsonObject<GraphLink>>)
            .map(item => GraphLink.fromJson(item));

        const clients = new Set(json.clients);

        return new OutputGraphData(clients, links);
    }

    constructor(clients: Set<string>, links: Array<GraphLink>) {
        super();

        this.clients = clients || new Set<string>();
        this.links = links || [];
    }

    public toJson(): object {
        const clients = Array.from(this.clients.keys());
        const links = this.links.map(item => item.toJson());

        return {clients, links};
    }
}
