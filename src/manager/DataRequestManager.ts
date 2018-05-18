import DataRequest from '../repository/models/DataRequest';
import { AccessRight } from '../utils/keypair/Permissions';

export interface DataRequestManager {

    /**
     * Creates data access request to a specific user for a specific personal data.
     * @param {string} recipientPk Public Key of the user that the personal data is requested from.
     * @param {Array<string>} fields Array of name identifiers for the requested data fields
     * (e.g. this is keys in {Map<string, string>}).
     *
     * @returns {Promise<number>} Returns requestID upon successful request record creation.
     */
    requestPermissions(recipientPk: string, fields: Array<string>): Promise<number>;

    /**
     * Returns a list of outstanding data access requests, where data access requests meet the provided search criteria.
     * @param {string} fromPk (Optional if toPk exist.) public key of the user that issued data access request.
     * @param {string} toPk (Optional if fromPk exist.) public key of the user that is expected to.
     *
     * @returns {Promise<Array<DataRequest>>}  List of {@link DataRequest}, or empty list
     */
    getRequests(fromPk: string, toPk: string): Promise<Array<DataRequest>>;

    /**
     * Grants access to specific fields of my data to a client.
     * @param {string} clientPk id (baseID) of the client that is authorized for data access.
     * @param {Map<string, AccessRight>} acceptedFields. Array of field names that are authorized for access
     * (e.g. these are keys in {Map<string, string>} - personal data).
     *
     * @returns {Promise<number>}
     */
    grantAccessForClient(clientPk: string, acceptedFields: Map<string, AccessRight>): Promise<number>;

    /**
     * Returns list of fields requested for access by <me> from the client
     * @param {string} requestedFromPk id (baseID) of the client whose permissions were requested
     * @returns {Promise<Array<string>>} Array of field names that were requested for access
     */
    getRequestedPermissions(requestedFromPk: string): Promise<Array<string>>

    /**
     * Returns list of fields requested for access by the client from <me>
     * @param {string} whoRequestedPk id (baseID) of the client that asked for permission from <me>
     * @returns {Promise<Array<string>>} Array of field names that were requested for access
     */
    getRequestedPermissionsToMe(whoRequestedPk: string): Promise<Array<string>>;

    /**
     * Returns list of fields that <client> authorized <me> to access
     * @param {string} clientPk id (baseID) of the client that granted me permission.
     * @returns {Promise<Array<string>>} Array of field names that were authorized for access
     */
    getGrantedPermissions(clientPk: string): Promise<Array<string>>;

    /**
     * Returns list of fields that <me> authorized <client> to access
     * @param {string} clientPk id (baseID) of the client that received access permission from <me>
     * @returns {Promise<Array<string>>} Array of field names that were authorized for access
     */
    getGrantedPermissionsToMe(clientPk: string): Promise<Array<string>>;

    /**
     * Grant access for offer.
     * @param {number} offerSearchId id of item search result {@link OfferSearch} and {@link OfferSearchResultItem}.
     * @param {string} offerOwner Public key of offer owner.
     * @param {Map<string, AccessRight>} acceptedFields. Map with names of fields for accept access and access rights.
     * (e.g. this is keys in {Map<string, string>} - personal data).
     *
     * @returns {Promise<void>}
     */
    grantAccessForOffer(offerSearchId: number, offerOwner: string, acceptedFields: Map<string, AccessRight>): Promise<void>;

    /**
     * Decodes a message that was encrypted by the owner of the private key that matches the provided public key.
     * @param {string} senderPk public key of the user that issued data access request.
     * @param {string} encrypted encrypted data from {@link DataRequest#requestData} (ECIES).
     *
     * @returns {object | null} object with data or null if was error.
     */
    decryptMessage(senderPk: string, encrypted: string): Promise<any>;

}
