import OfferShareData from './../models/OfferShareData';
export interface OfferShareDataRepository {
    getShareData(owner: string, accepted: boolean): Promise<Array<OfferShareData>>;
    acceptShareData(searchId: number, worth: string): Promise<void>;
}
