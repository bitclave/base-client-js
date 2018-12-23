import { ShareDataRepository } from './ShareDataRepository';
import { AccessRight } from '../../utils/keypair/Permissions';
import { DataRequestManager } from '../../manager/DataRequestManager';
import { ProfileManager } from '../../manager/ProfileManager';
import { OfferShareDataRepository } from './OfferShareDataRepository';
export default class ShareDataRepositoryImpl implements ShareDataRepository {
    private dataRequestManager;
    private profileManager;
    private offerShareDataRepository;
    private contract;
    private web3;
    private eth_wallets;
    private static min;
    private static max;
    private static gwei;
    private userShare;
    private spShare;
    constructor(dataRequestManager: DataRequestManager, profileManager: ProfileManager, offerShareDataRepository: OfferShareDataRepository, web3: any, contractAddress: string, eth_wallets: string);
    grantAccessForOffer(offerSearchId: number, offerOwner: string, acceptedFields: Map<string, AccessRight>, priceId: number, clientId: string): Promise<boolean>;
    acceptShareData(data: Map<string, string>, uid: string, bid: string, searchId: number, worth: string): Promise<Map<string, string>>;
    shareWithBusiness(key: string, value: string, uid: string): Promise<boolean>;
    isSharePointerExist(uid: string, bid: string): Promise<boolean>;
    /**
     * Check whether all the keys are granted.
     * @param from
     * @param to
     * @param keys
     */
    private checkRequestStatus;
    /**
     * Notify service provider to share data with business by writing TokenPointer in storage
     * and share it with service provider.
     * @param value Business generated nonce
     * @param key A tuple of the uid and spid
     * @param bid Id of the business to share the data
     */
    private notifyServiceProvider;
    private calculateHash;
    private grantAccessForClientHelper;
    /**
     * Helper function to verify the data received at business side
     * @param sharePointer
     * @param uid
     * @param bid
     * @param nonce
     */
    private businessVerifyMessage;
    private getRandomInt;
}
