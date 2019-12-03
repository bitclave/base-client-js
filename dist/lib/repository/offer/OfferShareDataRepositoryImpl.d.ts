import { AccountManager } from '../../manager/AccountManager';
import { ProfileManager } from '../../manager/ProfileManager';
import { HttpTransport } from '../source/http/HttpTransport';
import OfferShareData from './../models/OfferShareData';
import { OfferShareDataRepository } from './OfferShareDataRepository';
export default class OfferShareDataRepositoryImpl implements OfferShareDataRepository {
    private readonly transport;
    private readonly accountManager;
    private readonly profileManager;
    private readonly SHARE_DATA_API;
    private readonly NONCE_DATA_API;
    constructor(transport: HttpTransport, accountManager: AccountManager, profileManager: ProfileManager);
    getShareData(owner: string, accepted: boolean): Promise<Array<OfferShareData>>;
    acceptShareData(searchId: number, worth: string): Promise<void>;
}
