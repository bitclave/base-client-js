import { Observable } from 'rxjs/Rx';
import Account from '../repository/models/Account';
import { OfferRepository } from '../repository/offer/OfferRepository';
import Offer from '../repository/models/Offer';
import { OfferManager } from './OfferManager';

export class OfferManagerImpl implements OfferManager {

    private account: Account = new Account();
    private offerRepository: OfferRepository;

    constructor(offerRepository: OfferRepository, authAccountBehavior: Observable<Account>) {
        this.offerRepository = offerRepository;

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

    public getMyOffers(id: number = 0): Promise<Array<Offer>> {
        if (id > 0) {
            return this.offerRepository.getOfferByOwnerAndId(this.account.publicKey, id);

        } else {
            return this.offerRepository.getOfferByOwner(this.account.publicKey);
        }
    }

    public getAllOffers(): Promise<Array<Offer>> {
        return this.offerRepository.getAllOffer();
    }

    public deleteOffer(id: number): Promise<number> {
        return this.offerRepository.deleteById(this.account.publicKey, id);
    }

    private onChangeAccount(account: Account) {
        this.account = account;
    }

}
