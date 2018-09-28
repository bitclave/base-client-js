import { OfferShareDataRepository } from './OfferShareDataRepository';
import OfferShareData from './../models/OfferShareData';
import { AccountManager } from '../../manager/AccountManager';
import { ProfileManager } from '../../manager/ProfileManager';
export default class OfferShareDataRepositoryImpl implements OfferShareDataRepository {
    private readonly SHARE_DATA_API;
    private readonly NONCE_DATA_API;
    private host;
    private accountManager;
    private profileManager;
    constructor(host: string, accountManager: AccountManager, profileManager: ProfileManager);
    getShareData(owner: string, accepted: boolean): Promise<Array<OfferShareData>>;
    acceptShareData(searchId: number, worth: string): Promise<void>;
}
