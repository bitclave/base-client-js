import Offer from '../models/Offer';

export interface OfferRepository {

    create(owner: string, offer: Offer): Promise<Offer>;

    update(owner: string, id: number, offer: Offer): Promise<Offer>;

    deleteById(owner: string, id: number): Promise<number>;

    getOfferByOwnerAndId(owner: string, id: number): Promise<Array<Offer>>;

    getOfferByOwner(owner: string): Promise<Array<Offer>>;

    getAllOffer(): Promise<Array<Offer>>;

}
