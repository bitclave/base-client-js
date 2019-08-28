import { ClassCreator, DeepCopy } from './DeepCopy';
import { JsonObject } from './JsonObject';
import Offer from './Offer';
import { OfferInteraction } from './OfferInteraction';
import { OfferSearch } from './OfferSearch';

export default class OfferSearchResultItem extends DeepCopy<OfferSearchResultItem> {

    public readonly offerSearch: OfferSearch;
    public readonly offer: Offer;
    public readonly interaction: OfferInteraction | undefined;

    public static fromJson(json: object): OfferSearchResultItem {
        const raw = json as JsonObject<OfferSearchResultItem>;
        return new OfferSearchResultItem(
            OfferSearch.fromJson(raw.offerSearch as object),
            Offer.fromJson(raw.offer as object),
            raw.interaction ? OfferInteraction.fromJson(raw.interaction as object) : undefined
        );
    }

    constructor(
        offerSearch: OfferSearch = new OfferSearch(),
        offer: Offer = new Offer(),
        interaction?: OfferInteraction | undefined
    ) {
        super();
        this.offerSearch = offerSearch;
        this.offer = offer;
        this.interaction = interaction;
    }

    public toJson(): object {
        return {
            offerSearch: this.offerSearch.toJson(),
            offer: this.offer.toJson(),
            interaction: this.interaction ? this.interaction.toJson() : undefined
        };
    }

    protected deepCopyFromJson(): OfferSearchResultItem {
        return OfferSearchResultItem.fromJson(this.toJson());
    }

    protected getClass(): ClassCreator<OfferSearchResultItem> {
        return OfferSearchResultItem;
    }
}
