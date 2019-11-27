import Offer from '../../repository/models/Offer';
import { Page } from '../../repository/models/Page';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { ArrayDeserializer } from '../../utils/types/json-transform/deserializers/ArrayDeserializer';
import { PageDeserializer } from '../../utils/types/json-transform/deserializers/PageDeserializer';
import { OfferManager } from '../OfferManager';

export class RemoteOfferManagerImpl implements OfferManager {

    constructor(private readonly transport: RpcTransport) {
    }

    public deleteOffer(id: number): Promise<number> {
        return this.transport.request('offerManager.deleteOffer', [id]);
    }

    /**
     * @deprecated
     * @see getOffersByPage
     */
    public getAllOffers(): Promise<Array<Offer>> {
        throw new Error('deprecated method. not supported');
    }

    public getMyOffers(id: number): Promise<Array<Offer>> {
        return this.transport.request('offerManager.getMyOffers', [id], new ArrayDeserializer(Offer));
    }

    public getMyOffersAndPage(page?: number, size?: number): Promise<Page<Offer>> {
        return this.transport.request('offerManager.getMyOffersAndPage', [page, size], new PageDeserializer(Offer));
    }

    public getMyOffersByTag(tag: string): Promise<Array<Offer>> {
        return this.transport.request('offerManager.getMyOffersByTag', [tag], new ArrayDeserializer(Offer));
    }

    public getOffersByOwnerAndTag(owner: string, tag: string): Promise<Array<Offer>> {
        return this.transport.request(
            'offerManager.getOffersByOwnerAndTag',
            [owner, tag],
            new ArrayDeserializer(Offer)
        );
    }

    public getOffersByPage(page?: number, size?: number): Promise<Page<Offer>> {
        return this.transport.request('offerManager.getOffersByPage', [page, size], new PageDeserializer(Offer));
    }

    public saveOffer(offer: Offer): Promise<Offer> {
        return this.transport.request('offerManager.saveOffer', [offer.toJson()], Offer);
    }

    public shallowSaveOffer(offer: Offer): Promise<Offer> {
        return this.transport.request('offerManager.saveOffer', [offer.toJson()], Offer);
    }

    public updateBulkOffers(offers: Array<Offer>): Promise<Array<number>> {
        const jsonOffers = offers.map(item => item.toJson());

        return this.transport.request('offerManager.saveOffer', [jsonOffers]);
    }
}
