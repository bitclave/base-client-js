/**
 * Define methods that implement the data sharing protocol
 * between client, service provider and business.
 */
import { AccessRight } from '../../utils/keypair/Permissions';

export interface ShareDataRepository {

    /**
     * A wrapper function for grantAccessForOffer function defined in DataRequestManager that
     * implements the data sharing protocol.
     * This function will be used by client to "grant" an offer.
     * @param offerSearchId 
     * @param offerOwner 
     * @param acceptedFields 
     * @param priceId 
     */
    grantAccessForOffer(offerSearchId: number, offerOwner: string, acceptedFields: Map<string, AccessRight>, priceId: number, clientId: string): Promise<boolean>;

    /**
     * A wrapper function for acceptShareData function defined in OfferShareDataRepository that
     * implements the data sharing protocol.
     * This function will be used by business to "accept" an offer.
     * Return value is all the requested data entries.
     * @param data
     * @param uid
     * @param bid
     */
    acceptShareData(data: Map<string, string>, uid: string, bid: string, searchId: number, worth: string): Promise<Map<string, string>>;

    /**
     * A helper function for service provider to create entries and share data with business.
     * Service provider must first verify the key and value entry is a valid SharePointer entry.
     * @param key 
     * @param value 
     * @param uid 
     */
    shareWithBusiness(key: string, value: string, uid: string): Promise<boolean>;

    /**
     * Check at the service provider side that whether this is the first time
     * receive the TokenPointer granted by users by checking whether the corresponding
     * SharePointer exist
     * @param uid 
     * @param bid 
     */
    isSharePointerExist(uid: string, bid: string): Promise<boolean>;
}