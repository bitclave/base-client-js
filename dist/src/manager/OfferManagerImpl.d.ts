import { Observable } from 'rxjs/Rx';
import Account from '../repository/models/Account';
import { OfferRepository } from '../repository/offer/OfferRepository';
import Offer from '../repository/models/Offer';
import { OfferManager } from './OfferManager';
export declare class OfferManagerImpl implements OfferManager {
    private account;
    private offerRepository;
    constructor(offerRepository: OfferRepository, authAccountBehavior: Observable<Account>);
    saveOffer(offer: Offer): Promise<Offer>;
    getMyOffers(id?: number): Promise<Array<Offer>>;
    getAllOffers(): Promise<Array<Offer>>;
    deleteOffer(id: number): Promise<number>;
    private onChangeAccount;
}
