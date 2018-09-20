import { OfferRepository } from './OfferRepository';
import Offer from '../models/Offer';
import { HttpTransport } from '../source/http/HttpTransport';
export default class OfferRepositoryImpl implements OfferRepository {
    private readonly OFFER_API;
    private transport;
    constructor(transport: HttpTransport);
    create(owner: string, offer: Offer): Promise<Offer>;
    update(owner: string, id: number, offer: Offer): Promise<Offer>;
    deleteById(owner: string, id: number): Promise<number>;
    getOfferByOwnerAndId(owner: string, id: number): Promise<Array<Offer>>;
    getOfferByOwner(owner: string): Promise<Array<Offer>>;
    getAllOffer(): Promise<Array<Offer>>;
    private jsonToListOffers;
}
