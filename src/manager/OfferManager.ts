import Offer from '../repository/models/Offer';
import { Page } from '../repository/models/Page';

export interface OfferManager {

    saveOffer(offer: Offer): Promise<Offer>;

    getMyOffers(id: number): Promise<Array<Offer>>;

    getMyOffersAndPage(page?: number, size?: number): Promise<Page<Offer>>;

    getAllOffers(): Promise<Array<Offer>>;

    deleteOffer(id: number): Promise<number>;

    getOffersByOwnerAndTag(owner: string, tag: string): Promise<Array<Offer>>;

    getMyOffersByTag(tag: string): Promise<Array<Offer>>;

}
