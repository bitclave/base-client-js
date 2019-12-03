import { CompareAction } from './CompareAction';
import { ClassCreator, DeepCopy } from './DeepCopy';
import { OfferPrice } from './OfferPrice';
export default class Offer extends DeepCopy<Offer> {
    readonly id: number;
    readonly owner: string;
    description: string;
    title: string;
    imageUrl: string;
    worth: string;
    tags: Map<string, string>;
    compare: Map<string, string>;
    rules: Map<string, CompareAction>;
    offerPrices: OfferPrice[];
    createdAt: Date;
    updatedAt: Date;
    static fromJson(json: object): Offer;
    constructor(description?: string, title?: string, imageUrl?: string, worth?: string, tags?: Map<string, string>, compare?: Map<string, string>, rules?: Map<string, CompareAction>, offerPrices?: Array<OfferPrice>);
    toJson(): object;
    validPrices(data: Map<string, string>): Array<OfferPrice>;
    getPriceById(id: number): OfferPrice | undefined;
    protected deepCopyFromJson(): Offer;
    protected getClass(): ClassCreator<Offer>;
}
