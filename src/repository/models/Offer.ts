import { CompareAction } from './CompareAction';
import { JsonUtils } from '../../utils/JsonUtils';

export default class Offer {

    readonly id: number = 0;
    readonly owner: string = '0x0';
    description: string;
    title: string;
    imageUrl: string;
    worth: string;
    tags: Map<String, String>;
    compare: Map<String, String>;
    rules: Map<String, CompareAction>;

    public static fromJson(json: any): Offer {
        const offer: Offer = Object.assign(new Offer(), json);
        offer.tags = JsonUtils.jsonToMap(json['tags']);
        offer.compare = JsonUtils.jsonToMap(json['compare']);
        offer.rules = JsonUtils.jsonToMap(json['rules']);

        return offer;
    }

    constructor(description: string = '',
                title: string = '',
                imageUrl: string = '',
                worth: string = '0',
                tags: Map<String, String> = new Map(),
                compare: Map<String, String> = new Map(),
                rules: Map<String, CompareAction> = new Map()) {

        this.description = description;
        this.title = title;
        this.imageUrl = imageUrl;
        this.worth = worth;
        this.tags = tags;
        this.compare = compare;
        this.rules = rules;
    }

    public toJson(): any {
        const jsonStr = JSON.stringify(this);
        const json = JSON.parse(jsonStr);
        json['tags'] = JsonUtils.mapToJson(this.tags);
        json['compare'] = JsonUtils.mapToJson(this.compare);
        json['rules'] = JsonUtils.mapToJson(this.rules);
        for (let item in json['rules']) {
            if (typeof json['rules'][item] == 'number') {
                json['rules'][item] = CompareAction[json['rules'][item]].toString();
            }
        }
        return json;
    }

}
