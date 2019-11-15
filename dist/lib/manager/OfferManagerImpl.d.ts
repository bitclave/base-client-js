import { Observable } from 'rxjs/Rx';
import Account from '../repository/models/Account';
import Offer from '../repository/models/Offer';
import { Page } from '../repository/models/Page';
import { OfferRepository } from '../repository/offer/OfferRepository';
import { OfferManager } from './OfferManager';
export declare class OfferManagerImpl implements OfferManager {
    private readonly offerRepository;
    private account;
    constructor(offerRepository: OfferRepository, authAccountBehavior: Observable<Account>);
    saveOffer(offer: Offer): Promise<Offer>;
    updateBulkOffers(offers: Array<Offer>): Promise<Array<number>>;
    shallowSaveOffer(offer: Offer): Promise<Offer>;
    getMyOffers(id?: number): Promise<Array<Offer>>;
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
    private onChangeAccount;
}
