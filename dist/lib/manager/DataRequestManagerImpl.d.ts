import { Observable } from 'rxjs/Rx';
import Account from '../repository/models/Account';
import { DataRequest } from '../repository/models/DataRequest';
import { FieldData } from '../repository/models/FieldData';
import { InputGraphData } from '../repository/models/InputGraphData';
import { OutputGraphData } from '../repository/models/OutputGraphData';
import { DataRequestRepository } from '../repository/requests/DataRequestRepository';
import { MessageDecrypt } from '../utils/keypair/MessageDecrypt';
import { MessageEncrypt } from '../utils/keypair/MessageEncrypt';
import { AccessRight } from '../utils/keypair/Permissions';
import { DataRequestManager } from './DataRequestManager';
export declare class DataRequestManagerImpl implements DataRequestManager {
    private account;
    private dataRequestRepository;
    private encrypt;
    private decrypt;
    constructor(dataRequestRepository: DataRequestRepository, authAccountBehavior: Observable<Account>, encrypt: MessageEncrypt, decrypt: MessageDecrypt);
    getRequestsGraph(data: InputGraphData): Promise<OutputGraphData>;
    /**
     * Creates data access request to a specific user for a specific personal data.
     * @param {string} recipientPk Public Key of the user that the personal data is requested from.
     * @param {Array<string>} fields Array of name identifiers for the requested data fields
     * (e.g. this is keys in {Map<string, string>}).
     *
     * @returns {Promise<void>}
     */
    requestPermissions(recipientPk: string, fields: Array<string>): Promise<void>;
    /**
     * Returns a list of outstanding data access requests, where data access requests meet the provided search criteria.
     * @param {string} fromPk (Optional if toPk exist.) public key of the user that issued data access request.
     * @param {string} toPk (Optional if fromPk exist.) public key of the user that is expected to.
     *
     * @returns {Promise<Array<DataRequest>>}  List of {@link DataRequest}, or empty list
     */
    getRequests(fromPk: string | null, toPk: string | null): Promise<Array<DataRequest>>;
    /**
     * Grants access to specific fields of my data to a client.
     * @param {string} clientPk id (baseID) of the client that is authorized for data access.
     * @param {Map<string, AccessRight>} acceptedFields. Array of field names that are authorized for access
     * (e.g. these are keys in {Map<string, string>} - personal data).
     * @param {string} rootPk ID (baseID) of the client that is the data owner.
     *
     * @returns {Promise<void>}
     */
    grantAccessForClient(clientPk: string, acceptedFields: Map<string, AccessRight>, rootPk?: string): Promise<void>;
    /**
     * revoke access to specific fields of my data to a client.
     * @param {string} clientPk id (baseID) of the client that is authorized for data access.
     * @param {Array<string>} revokeFields. Array of field names that are authorized for access
     * (e.g. these are keys in {Map<string, string>} - personal data).
     *
     * @returns {Promise<void>}
     */
    revokeAccessForClient(clientPk: string, revokeFields: Array<string>): Promise<void>;
    /**
     * Returns list of fields requested for access by <me> from the client
     * @param {string} requestedFromPk id (baseID) of the client whose permissions were requested. is optional.
     * @returns {Promise<Array<string>>} Array of field names that were requested for access
     */
    getRequestedPermissions(requestedFromPk?: string | undefined): Promise<Array<FieldData>>;
    /**
     * Returns list of fields requested for access by the client from <me>
     * @param {string} whoRequestedPk id (baseID) of the client that asked for permission from <me>. is optional.
     * @returns {Promise<Array<string>>} Array of field names that were requested for access
     */
    getRequestedPermissionsToMe(whoRequestedPk?: string | undefined): Promise<Array<FieldData>>;
    /**
     * Returns list of fields that <client> authorized <me> to access
     * @param {string} clientPk id (baseID) of the client that granted me permission.
     * @returns {Promise<Array<string>>} Array of field names that were authorized for access
     */
    getGrantedPermissions(clientPk: string): Promise<Array<string>>;
    /**
     * @deprecated
     *
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
    grantAccessForOffer(offerSearchId: number, offerOwner: string, acceptedFields: Map<string, AccessRight>, priceId: number): Promise<void>;
    /**
     * Decodes a message that was encrypted by the owner of the private key that matches the provided public key.
     * @param {string} senderPk public key of the user that issued data access request.
     * @param {string} encrypted encrypted data from {@link DataRequest#requestData} (ECIES).
     *
     * @returns {object | null} object with data or null if was error.
     */
    decryptMessage(senderPk: string, encrypted: string): Promise<object | string>;
    private encryptGrantedFields;
    private decodeRequestedPermissions;
    private getDecodeGrantPermissions;
    private onChangeAccount;
}
