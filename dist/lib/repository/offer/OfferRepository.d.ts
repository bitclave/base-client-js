import Offer from '../models/Offer';
import { Page } from '../models/Page';
export interface OfferRepository {
    create(owner: string, offer: Offer): Promise<Offer>;
    update(owner: string, id: number, offer: Offer): Promise<Offer>;
    updateBulk(owner: string, offers: Array<Offer>): Promise<Array<number>>;
    shallowUpdate(owner: string, id: number, offer: Offer): Promise<Offer>;
    deleteById(owner: string, id: number): Promise<number>;
    getOfferByOwnerAndId(owner: string, id: number): Promise<Array<Offer>>;
    getOfferByOwner(owner: string): Promise<Array<Offer>>;
    getOfferByOwnerAndPage(owner: string, page?: number, size?: number): Promise<Page<Offer>>;
    getOffersByPage(page?: number, size?: number): Promise<Page<Offer>>;
    /**
     * @deprecated
     * @see getOffersByPage
     */
    getAllOffer(): Promise<Array<Offer>>;
    getOffersByOwnerAndTag(owner: string, tag: string): Promise<Array<Offer>>;
}
