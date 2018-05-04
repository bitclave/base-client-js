import { DataRequestRepository } from '../repository/requests/DataRequestRepository';
import { MessageEncrypt } from '../utils/keypair/MessageEncrypt';
import { MessageDecrypt } from '../utils/keypair/MessageDecrypt';
import DataRequest from '../repository/models/DataRequest';
import Account from '../repository/models/Account';
import { Observable } from 'rxjs/Rx';
export declare class DataRequestManager {
    private account;
    private dataRequestRepository;
    private encrypt;
    private decrypt;
    constructor(dataRequestRepository: DataRequestRepository, authAccountBehavior: Observable<Account>, encrypt: MessageEncrypt, decrypt: MessageDecrypt);
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
    getRequests(fromPk?: string, toPk?: string): Promise<Array<DataRequest>>;
    /**
     * Grant access data for client.
     * @param {string} clientPk id of client.
     * @param {Map<string, string>} acceptedFields. Arrays names of fields for accept access.
     * (e.g. this is keys in {Map<string, string>} - personal data).
     *
     * @returns {Promise<number>}
     */
    grantAccessForClient(clientPk: string, acceptedFields: Array<string>): Promise<number>;
    /**
     * Returns the list of permissions requested from the client
     * @param {string} requestedFromPk The public key of the client whose permission is requested
     * @returns {Promise<Array<string>>} list with names of fields.
     */
    getRequestedPermissions(requestedFromPk: string): Promise<Array<string>>;
    /**
     * Returns the list of permissions requested from the client
     * @param {string} whoRequestedPk The public key of the client whose permission is requested
     * @returns {Promise<Array<string>>} list with names of fields.
     */
    getRequestedPermissionsToMe(whoRequestedPk: string): Promise<Array<string>>;
    /**
     * Returns the list of permissions granted to the client
     * @param {string} clientPk the public key of the client that was given permission.
     * @returns {Promise<Array<string>>} list with names of fields.
     */
    getGrantedPermissions(clientPk: string): Promise<Array<string>>;
    /**
     * Returns the list of permissions granted to the client
     * @param {string} clientPk the public key of the client that was given permission.
     * @returns {Promise<Array<string>>} list with names of fields.
     */
    getGrantedPermissionsToMe(clientPk: string): Promise<Array<string>>;
    /**
     * Grant access for offer.
     * @param {number} offerId id of Offer.
     * @param {string} offerOwner Public key of offer owner.
     * @param {Map<string, string>} acceptedFields. Arrays names of fields for accept access.
     * (e.g. this is keys in {Map<string, string>} - personal data).
     *
     * @returns {Promise<void>}
     */
    grantAccessForOffer(offerId: number, offerOwner: string, acceptedFields: Array<string>): Promise<void>;
    /**
     * Decodes a message that was encrypted by the owner of the private key that matches the provided public key.
     * @param {string} senderPk public key of the user that issued data access request.
     * @param {string} encrypted encrypted data from {@link DataRequest#requestData} (ECIES).
     *
     * @returns {object | null} object with data or null if was error.
     */
    decryptMessage(senderPk: string, encrypted: string): Promise<any>;
    private getEncryptedDataForFields(recipientPk, fields?);
    private onChangeAccount(account);
}
