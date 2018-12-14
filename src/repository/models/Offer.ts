import { CompareAction } from './CompareAction';
import { OfferPrice } from './OfferPrice';
import { OfferPriceRules } from './OfferPriceRules';
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
    offerPrices = new Array<OfferPrice>();

    public static fromJson(json: any): Offer {
        const offer: Offer = Object.assign(new Offer(), json);

        offer.tags = JsonUtils.jsonToMap(json.tags);
        offer.compare = JsonUtils.jsonToMap(json.compare);
        offer.rules = JsonUtils.jsonToMap(json.rules);

        if (json.offerPrices && json.offerPrices.length) {
          offer.offerPrices = json.offerPrices.map( (e: OfferPrice) => {
              const offerRules: Array<OfferPriceRules> = e.rules && e.rules.length
                ? e.rules.map( r => OfferPriceRules.fromJson(r))
                : Array<OfferPriceRules>();
              return new OfferPrice(e.id, e.description, e.worth, offerRules);
          });
        }
        else
        {
            if (offer.compare.size>0)
            {
                let key: String = Array.from(offer.compare.keys())[0]
                let val: String = offer.compare.get(key) || ""

                offer.offerPrices = [
                    
                    new OfferPrice(
                        0, "default", offer.worth, [
                            new OfferPriceRules(0, key.toString(), val.toString(), offer.rules[0])
                        ]
                    )
                ]
            }
        }
        return offer;
    }

    constructor(description: string = '',
                title: string = '',
                imageUrl: string = '',
                worth: string = '0',
                tags: Map<String, String> = new Map(),
                compare: Map<String, String> = new Map(),
                rules: Map<String, CompareAction> = new Map(),
                offerPrices: Array<OfferPrice> = new Array<OfferPrice>()
    ) {

        this.description = description;
        this.title = title;
        this.imageUrl = imageUrl;
        this.worth = worth;
        this.tags = tags;
        this.compare = compare;
        this.rules = rules;
        this.offerPrices = offerPrices;

        if (this.offerPrices.length==0 && this.compare.size>0)
        {
            let key: String = Array.from(compare.keys())[0]
            let val: String = compare.get(key) || ""

            this.offerPrices = [
                
                new OfferPrice(
                    0, "default", worth, [
                        new OfferPriceRules(0, key.toString(), val.toString(), rules[0])
                    ]
                )
            ]
        }
    }

    public toJson(): any {
        const jsonStr = JSON.stringify(this);
        const json = JSON.parse(jsonStr);
        json.tags = JsonUtils.mapToJson(this.tags);
        json.compare = JsonUtils.mapToJson(this.compare);
        json.rules = JsonUtils.mapToJson(this.rules);
        for (let item in json.rules) {
            if (typeof json.rules[item] === 'number') {
                json.rules[item] = CompareAction[json.rules[item]].toString();
            }
        }
        json.offerPrices = this.offerPrices.map(e =>
            e.toJson()
        );
        return json;
    }

    public validPrices(data: Map<string, string>): Array<OfferPrice> {

        let mostRelevantPrice =  this.offerPrices.filter( price => price.isRelevant(data));
        mostRelevantPrice.sort((a,b) => a.id-b.id);

        return mostRelevantPrice;
    }
    getPriceById(id: number): OfferPrice | undefined {
        if (this.offerPrices && this.offerPrices.length > 0) {
            const price = this.offerPrices.find( p =>
                p.id === id
            );
            return price;
        } else {
            return undefined;
        }
    }
}
