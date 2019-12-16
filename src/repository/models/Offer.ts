import { JsonUtils } from '../../utils/JsonUtils';
import { CompareAction } from './CompareAction';
import { ClassCreator, DeepCopy } from './DeepCopy';
import { OfferPrice } from './OfferPrice';
import { OfferPriceRules } from './OfferPriceRules';

export default class Offer extends DeepCopy<Offer> {

    public readonly id: number = 0;
    public readonly owner: string = '0x0';
    public description: string;
    public title: string;
    public imageUrl: string;
    public worth: string;
    public tags: Map<string, string>;
    public compare: Map<string, string>;
    public rules: Map<string, CompareAction>;
    public offerPrices = new Array<OfferPrice>();
    public createdAt: Date = new Date();
    public updatedAt: Date = new Date();

    public static fromJson(json: object): Offer {
        const offer: Offer = Object.assign(new Offer(), json);

        offer.tags = JsonUtils.jsonToMap(offer.tags);
        offer.compare = JsonUtils.jsonToMap(offer.compare);
        offer.rules = JsonUtils.jsonToMap(offer.rules);
        offer.createdAt = JsonUtils.jsonDateToDate(offer.createdAt);
        offer.updatedAt = JsonUtils.jsonDateToDate(offer.updatedAt);

        if (offer.offerPrices && offer.offerPrices.length) {
            offer.offerPrices = offer.offerPrices.map((e: OfferPrice) => {
                const offerRules: Array<OfferPriceRules> = e.rules && e.rules.length
                                                           ? e.rules.map(r => OfferPriceRules.fromJson(r))
                                                           : Array<OfferPriceRules>();
                return new OfferPrice(e.id, e.description, e.worth, offerRules);
            });
        } else {
            if (offer.compare.size > 0) {
                const key: string = Array.from(offer.compare.keys())[0];
                const val: string = offer.compare.get(key) || '';

                offer.offerPrices = [
                    new OfferPrice(
                        0, 'default', offer.worth, [
                            new OfferPriceRules(0, key.toString(), val.toString(), offer.rules[0])
                        ]
                    )
                ];
            }
        }
        return offer;
    }

    constructor(
        description: string = '',
        title: string = '',
        imageUrl: string = '',
        worth: string = '0',
        tags: Map<string, string> = new Map(),
        compare: Map<string, string> = new Map(),
        rules: Map<string, CompareAction> = new Map(),
        offerPrices: Array<OfferPrice> = new Array<OfferPrice>()
    ) {
        super();
        this.description = description;
        this.title = title;
        this.imageUrl = imageUrl;
        this.worth = worth;
        this.tags = tags;
        this.compare = compare;
        this.rules = rules;
        this.offerPrices = offerPrices;
        this.createdAt = new Date();
        this.updatedAt = new Date();

        if (this.offerPrices.length === 0 && this.compare.size > 0) {
            const key: string = Array.from(compare.keys())[0];
            const val: string = compare.get(key) || '';

            this.offerPrices = [

                new OfferPrice(
                    0, 'default', worth, [
                        new OfferPriceRules(0, key.toString(), val.toString(), rules[0])
                    ]
                )
            ];
        }
    }

    public toJson(): object {
        const jsonStr = JSON.stringify(this);
        const json = JSON.parse(jsonStr);
        json.tags = JsonUtils.mapToJson(this.tags);
        json.compare = JsonUtils.mapToJson(this.compare);
        json.rules = JsonUtils.mapToJson(this.rules);
        json.createdAt = this.createdAt.toJSON();
        json.updatedAt = this.updatedAt.toJSON();

        for (const item in json.rules) {
            if (typeof json.rules[item] === 'number') {
                json.rules[item] = CompareAction[json.rules[item]].toString();
            }
        }
        json.offerPrices = this.offerPrices.map(e => e.toJson());
        return json;
    }

    public validPrices(data: Map<string, string>): Array<OfferPrice> {

        const mostRelevantPrice = this.offerPrices.filter(price => price.isRelevant(data));
        mostRelevantPrice.sort((a, b) => a.id - b.id);

        return mostRelevantPrice;
    }

    public getPriceById(id: number): OfferPrice | undefined {
        if (this.offerPrices && this.offerPrices.length > 0) {
            return this.offerPrices.find(p => p.id === id);
        }

        return undefined;
    }

    protected deepCopyFromJson(): Offer {
        return Offer.fromJson(this.toJson());
    }

    protected getClass(): ClassCreator<Offer> {
        return Offer;
    }
}
