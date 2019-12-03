import Offer from '../repository/models/Offer';
import { Page } from '../repository/models/Page';
export interface OfferManager {
    saveOffer(offer: Offer): Promise<Offer>;
    updateBulkOffers(offers: Array<Offer>): Promise<Array<number>>;
    shallowSaveOffer(offer: Offer): Promise<Offer>;
    getMyOffers(id: number): Promise<Array<Offer>>;
    getMyOffersAndPage(page?: number, size?: number): Promise<Page<Offer>>;
    /**
     * @deprecated
     * @see getOffersByPage
     */
    getAllOffers(): Promise<Array<Offer>>;
    getOffersByPage(page?: number, size?: number): Promise<Page<Offer>>;
    deleteOffer(id: number): Promise<number>;
    getOffersByOwnerAndTag(owner: string, tag: string): Promise<Array<Offer>>;
    getMyOffersByTag(tag: string): Promise<Array<Offer>>;
}
