import Offer from './Offer';
import OfferSearch from './OfferSearch';

export default class OfferSearchResultItem {

    public readonly offerSearch: OfferSearch;
    public readonly offer: Offer;

    constructor(offerSearch: OfferSearch = new OfferSearch(), offer: Offer = new Offer()) {
        this.offerSearch = offerSearch;
        this.offer = offer;
    }

}
