import { CompareAction } from './CompareAction';
import { OfferPrice } from './OfferPrice';
export default class Offer {
    readonly id: number;
    readonly owner: string;
    description: string;
    title: string;
    imageUrl: string;
    worth: string;
    tags: Map<String, String>;
    compare: Map<String, String>;
    rules: Map<String, CompareAction>;
    offerPrices: OfferPrice[];
    static fromJson(json: any): Offer;
    constructor(description?: string, title?: string, imageUrl?: string, worth?: string, tags?: Map<String, String>, compare?: Map<String, String>, rules?: Map<String, CompareAction>, offerPrices?: Array<OfferPrice>);
    toJson(): any;
    validPrices(data: Map<string, string>): Array<OfferPrice>;
    getPriceById(id: number): OfferPrice | undefined;
}
