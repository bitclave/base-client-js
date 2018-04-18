import { OfferRepository } from './OfferRepository';
import Offer from '../models/Offer';
import { HttpMethod } from '../source/http/HttpMethod';
import { HttpTransport } from '../source/http/HttpTransport';

export default class OfferRepositoryImpl implements OfferRepository {

    private readonly OFFER_API: string = '/v1/client/{owner}/offer/{id}';

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    public create(owner: string, offer: Offer): Promise<Offer> {
        return this.transport.sendRequest(
            this.OFFER_API.replace('{owner}', owner).replace('{id}', ''),
            HttpMethod.Put,
            offer.toJson()
        ).then((response) => Offer.fromJson(response.json));
    }

    public update(owner: string, id: number, offer: Offer): Promise<Offer> {
        return this.transport.sendRequest(
            this.OFFER_API.replace('{owner}', owner).replace('{id}', id.toString()),
            HttpMethod.Put,
            offer.toJson()
        ).then((response) => Offer.fromJson(response.json));
    }

    public deleteById(owner: string, id: number): Promise<number> {
        return this.transport.sendRequest(
            this.OFFER_API.replace('{owner}', owner).replace('{id}', id.toString()),
            HttpMethod.Delete,
            id,
        ).then((response) => parseInt(response.json.toString()));
    }

    public getOfferByOwnerAndId(owner: string, id: number): Promise<Array<Offer>> {
        return this.transport.sendRequest(
            this.OFFER_API.replace('{owner}', owner).replace('{id}', id.toString()),
            HttpMethod.Get
        ).then((response) => this.jsonToListOffers(response.json));
    }

    public getOfferByOwner(owner: string): Promise<Array<Offer>> {
        return this.transport.sendRequest(
            this.OFFER_API.replace('{owner}', owner).replace('{id}', ''),
            HttpMethod.Get
        ).then((response) => this.jsonToListOffers(response.json));
    }

    public getAllOffer(): Promise<Array<Offer>> {
        return this.transport.sendRequest(
            this.OFFER_API.replace('{owner}', '0x0').replace('{id}', ''),
            HttpMethod.Get
        ).then((response) => this.jsonToListOffers(response.json));
    }

    private jsonToListOffers(json: any): Array<Offer> {
        const result: Array<Offer> = [];

        for (let item of json) {
            result.push(Offer.fromJson(item));
        }

        return result;
    }

}
