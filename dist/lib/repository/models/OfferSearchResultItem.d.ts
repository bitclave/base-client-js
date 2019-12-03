import { ClassCreator, DeepCopy } from './DeepCopy';
import Offer from './Offer';
import { OfferInteraction } from './OfferInteraction';
import { OfferSearch } from './OfferSearch';
export default class OfferSearchResultItem extends DeepCopy<OfferSearchResultItem> {
    readonly offerSearch: OfferSearch;
    readonly offer: Offer;
    readonly interaction: OfferInteraction | undefined;
    static fromJson(json: object): OfferSearchResultItem;
    constructor(offerSearch?: OfferSearch, offer?: Offer, interaction?: OfferInteraction | undefined);
    toJson(): object;
    protected deepCopyFromJson(): OfferSearchResultItem;
    protected getClass(): ClassCreator<OfferSearchResultItem>;
}
