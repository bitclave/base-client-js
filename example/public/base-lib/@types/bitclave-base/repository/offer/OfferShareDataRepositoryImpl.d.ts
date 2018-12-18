import { OfferShareDataRepository } from './OfferShareDataRepository';
import { default as Base, OfferShareData } from './../../Base';
export default class OfferShareDataRepositoryImpl implements OfferShareDataRepository {
    private readonly SHARE_DATA_API;
    private readonly NONCE_DATA_API;
    private host;
    private base;
    constructor(host: string, base: Base);
    getShareData(owner: string, accepted: boolean): Promise<Array<OfferShareData>>;
    acceptShareData(searchId: number, worth: string): Promise<void>;
}
