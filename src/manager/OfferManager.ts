import Offer from '../repository/models/Offer';

export interface OfferManager {

    saveOffer(offer: Offer): Promise<Offer>;

    getMyOffers(id: number): Promise<Array<Offer>>;

    getAllOffers(): Promise<Array<Offer>>;

    deleteOffer(id: number): Promise<number>;

}
