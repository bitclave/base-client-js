import { Observable } from 'rxjs';
import Account from '../repository/models/Account';
import Offer from '../repository/models/Offer';
import { Page } from '../repository/models/Page';
import { OfferRepository } from '../repository/offer/OfferRepository';
import { OfferManager } from './OfferManager';

export class OfferManagerImpl implements OfferManager {

    private account: Account = new Account();

    constructor(private readonly offerRepository: OfferRepository, authAccountBehavior: Observable<Account>) {
        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));
    }

    public saveOffer(offer: Offer): Promise<Offer> {
        const offerId: number = offer.id;

        if (offerId <= 0) {
            return this.offerRepository.create(this.account.publicKey, offer);

        } else {
            return this.offerRepository.update(this.account.publicKey, offerId, offer);
        }
    }
    public updateBulkOffers(offers: Array<Offer>): Promise<Array<number>> {
        return this.offerRepository.updateBulk(this.account.publicKey, offers);
    }

    public shallowSaveOffer(offer: Offer): Promise<Offer> {
        const offerId: number = offer.id;
        return this.offerRepository.shallowUpdate(this.account.publicKey, offerId, offer);
    }

    public getMyOffers(id: number = 0): Promise<Array<Offer>> {
        if (id > 0) {
            return this.offerRepository.getOfferByOwnerAndId(this.account.publicKey, id);

        } else {
            return this.offerRepository.getOfferByOwner(this.account.publicKey);
        }
    }

    public getMyOffersAndPage(page?: number, size?: number): Promise<Page<Offer>> {
        return this.offerRepository.getOfferByOwnerAndPage(this.account.publicKey, page, size);
    }

    /**
     * @deprecated
     * @see getOffersByPage
     */
    public getAllOffers(): Promise<Array<Offer>> {
        return this.offerRepository.getAllOffer();
    }

    public getOffersByPage(page?: number, size?: number): Promise<Page<Offer>> {
        return this.offerRepository.getOffersByPage(page, size);
    }

    public deleteOffer(id: number): Promise<number> {
        return this.offerRepository.deleteById(this.account.publicKey, id);
    }

    public getOffersByOwnerAndTag(owner: string, tag: string): Promise<Array<Offer>> {
        return this.offerRepository.getOffersByOwnerAndTag(owner, tag);
    }

    public getMyOffersByTag(tag: string): Promise<Array<Offer>> {
        return this.offerRepository.getOffersByOwnerAndTag(this.account.publicKey, tag);
    }

    private onChangeAccount(account: Account) {
        this.account = account;
    }
}
