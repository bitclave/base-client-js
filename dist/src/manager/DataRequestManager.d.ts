import { DataRequestRepository } from '../repository/requests/DataRequestRepository';
import { MessageEncrypt } from '../utils/keypair/MessageEncrypt';
import { MessageDecrypt } from '../utils/keypair/MessageDecrypt';
import { DataRequestState } from '../repository/models/DataRequestState';
import DataRequest from '../repository/models/DataRequest';
export default class DataRequestManager {
    private dataRequestRepository;
    private encrypt;
    private decrypt;
    constructor(dataRequestRepository: DataRequestRepository, encrypt: MessageEncrypt, decrypt: MessageDecrypt);
    /**
     * Creates data access request to a specific user for a specific personal data.
     * @param {string} recipientPk Public Key of the user that the personal data is requested from.
     * @param {Array<string>} fields Array of name identifiers for the requested data fields
     * (e.g. this is keys in {Map<string, string>}).
     *
     * @returns {Promise<string>} Returns requestID upon successful request record creation.
     */
    createRequest(recipientPk: string, fields: Array<string>): Promise<string>;
    /**
     * Creates a response to a previously submitted data access request.
     * @param {number} requestId ID of existed the request.
     * @param {string} senderPk Public key of the user that issued data access request.
     * @param {Array<string>} fields (Optional). null or empty for {@link DataRequestState.REJECT}.
     * Arrays names of fields for accept access. (e.g. this is keys in {Map<string, string>} - personal data).
     *
     * @returns {Promise<DataRequestState>} state of request of data {@link DataRequestState}.
     */
    responseToRequest(requestId: number, senderPk: string, fields?: Array<string>): Promise<DataRequestState>;
    /**
     * Returns a list of outstanding data access requests, where data access requests meet the provided search criteria.
     * @param {string} fromPk (Optional if toPk exist.) public key of the user that issued data access request.
     * @param {string} toPk (Optional if fromPk exist.) public key of the user that is expected to.
     * @param {DataRequestState} state of request.
     *
     * @returns {Promise<Array<DataRequest>>}  List of {@link DataRequest}, or empty list
     */
    getRequests(fromPk: string | undefined, toPk: string | undefined, state: DataRequestState): Promise<Array<DataRequest>>;
    /**
     * Decodes a message that was encrypted by the owner of the private key that matches the provided public key.
     * @param {string} senderPk public key of the user that issued data access request.
     * @param {string} encrypted encrypted data from {@link DataRequest#requestData} (ECIES).
     *
     * @returns {object} object with data or empty object if was error.
     */
    decryptMessage(senderPk: string, encrypted: string): any;
}
