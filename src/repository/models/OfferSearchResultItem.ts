import OfferSearch from './OfferSearch';
import Offer from './Offer';

export default class OfferSearchResultItem {

    offerSearch: OfferSearch;
    offer: Offer;

    constructor(offerSearch: OfferSearch = new OfferSearch(), offer: Offer = new Offer()) {
        this.offerSearch = offerSearch;
        this.offer = offer;
    }

}
