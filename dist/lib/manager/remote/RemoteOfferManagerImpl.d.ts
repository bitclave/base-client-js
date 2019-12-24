import Offer from '../../repository/models/Offer';
import { Page } from '../../repository/models/Page';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { OfferManager } from '../OfferManager';
export declare class RemoteOfferManagerImpl implements OfferManager {
    private readonly transport;
    constructor(transport: RpcTransport);
    deleteOffer(id: number): Promise<number>;
    /**
     * @deprecated
     * @see getOffersByPage
     */
    getAllOffers(): Promise<Array<Offer>>;
    getMyOffers(id: number): Promise<Array<Offer>>;
    getMyOffersAndPage(page?: number, size?: number): Promise<Page<Offer>>;
    getMyOffersByTag(tag: string): Promise<Array<Offer>>;
    getOffersByOwnerAndTag(owner: string, tag: string): Promise<Array<Offer>>;
    getOffersByPage(page?: number, size?: number): Promise<Page<Offer>>;
    saveOffer(offer: Offer): Promise<Offer>;
    shallowSaveOffer(offer: Offer): Promise<Offer>;
    updateBulkOffers(offers: Array<Offer>): Promise<Array<number>>;
}
