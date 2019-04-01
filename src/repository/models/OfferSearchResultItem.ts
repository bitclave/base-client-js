import { DeepCopy } from './ObjectClone';
import Offer from './Offer';
import OfferSearch from './OfferSearch';

export default class OfferSearchResultItem extends DeepCopy<OfferSearchResultItem> {

    public readonly offerSearch: OfferSearch;
    public readonly offer: Offer;

    public static fromJson(json: object): OfferSearchResultItem {
        const raw = json as JsonObject<OfferSearchResultItem>;
        return new OfferSearchResultItem(
            OfferSearch.fromJson(raw.offerSearch as object),
            Offer.fromJson(raw.offer as object)
        );
    }

    constructor(offerSearch: OfferSearch = new OfferSearch(), offer: Offer = new Offer()) {
        super();
        this.offerSearch = offerSearch;
        this.offer = offer;
    }

    public toJson(): object {
        return {
            offerSearch: this.offerSearch.toJson(),
            offer: this.toJson()
        };
    }

    protected deepCopyFromJson(): OfferSearchResultItem {
        return OfferSearchResultItem.fromJson(this.toJson());
    }
}
