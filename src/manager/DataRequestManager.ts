import { DataRequestRepository } from '../repository/requests/DataRequestRepository';
import { MessageEncrypt } from '../utils/keypair/MessageEncrypt';
import { MessageDecrypt } from '../utils/keypair/MessageDecrypt';
import { DataRequestState } from '../repository/models/DataRequestState';
import JsonUtils from '../utils/JsonUtils';
import DataRequest from '../repository/models/DataRequest';
import Account from '../repository/models/Account';
import { Observable } from 'rxjs/Rx';

export default class DataRequestManager {

    private account: Account;
    private dataRequestRepository: DataRequestRepository;
    private encrypt: MessageEncrypt;
    private decrypt: MessageDecrypt;

    constructor(dataRequestRepository: DataRequestRepository,
                authAccountBehavior: Observable<Account>,
                encrypt: MessageEncrypt, decrypt: MessageDecrypt) {
        this.dataRequestRepository = dataRequestRepository;
        this.encrypt = encrypt;
        this.decrypt = decrypt;

        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));
    }

    /**
     * Creates data access request to a specific user for a specific personal data.
     * @param {string} recipientPk Public Key of the user that the personal data is requested from.
     * @param {Array<string>} fields Array of name identifiers for the requested data fields
     * (e.g. this is keys in {Map<string, string>}).
     *
     * @returns {Promise<number>} Returns requestID upon successful request record creation.
     */
    public createRequest(recipientPk: string, fields: Array<string>): Promise<number> {
        const encrypted = this.encrypt
            .encryptMessage(recipientPk, JSON.stringify(fields).toLowerCase());

        return this.dataRequestRepository.createRequest(recipientPk, encrypted);
    }

    /**
     * Creates a response to a previously submitted data access request.
     * @param {number} requestId ID of existed the request.
     * @param {string} senderPk Public key of the user that issued data access request.
     * @param {Array<string>} fields (Optional). null or empty for {@link DataRequestState.REJECT}.
     * Arrays names of fields for accept access. (e.g. this is keys in {Map<string, string>} - personal data).
     *
     * @returns {Promise<DataRequestState>} state of request of data {@link DataRequestState}.
     */
    public responseToRequest(requestId: number, senderPk: string,
                             fields?: Array<string>): Promise<DataRequestState> {
        return this.dataRequestRepository.createResponse(requestId, this.getEncryptedDataForFields(senderPk, fields));
    }

    /**
     * Returns a list of outstanding data access requests, where data access requests meet the provided search criteria.
     * @param {string} fromPk (Optional if toPk exist.) public key of the user that issued data access request.
     * @param {string} toPk (Optional if fromPk exist.) public key of the user that is expected to.
     * @param {DataRequestState} state of request.
     *
     * @returns {Promise<Array<DataRequest>>}  List of {@link DataRequest}, or empty list
     */
    public getRequests(fromPk: string = '', toPk: string = '', state: DataRequestState): Promise<Array<DataRequest>> {
        return this.dataRequestRepository.getRequests(fromPk, toPk, state);
    }

    /**
     * Grant access data for client.
     * @param {string} clientPk id of client.
     * @param {Map<string, string>} acceptedFields. Arrays names of fields for accept access.
     * (e.g. this is keys in {Map<string, string>} - personal data).
     *
     * @returns {Promise<number>}
     */
    public grantAccessForClient(clientPk: string, acceptedFields: Array<string>): Promise<number> {
        return this.dataRequestRepository.grantAccessForClient(
            clientPk,
            this.account.publicKey,
            this.getEncryptedDataForFields(clientPk, acceptedFields)
        );
    }

    /**
     * Grant access for offer.
     * @param {number} offerId id of Offer.
     * @param {string} offerOwner Public key of offer owner.
     * @param {Map<string, string>} acceptedFields. Arrays names of fields for accept access.
     * (e.g. this is keys in {Map<string, string>} - personal data).
     *
     * @returns {Promise<void>}
     */
    public grantAccessForOffer(offerId: number, offerOwner: string, acceptedFields: Array<string>): Promise<void> {
        return this.dataRequestRepository.grantAccessForOffer(
            offerId,
            this.account.publicKey,
            this.getEncryptedDataForFields(offerOwner, acceptedFields)
        );
    }

    /**
     * Decodes a message that was encrypted by the owner of the private key that matches the provided public key.
     * @param {string} senderPk public key of the user that issued data access request.
     * @param {string} encrypted encrypted data from {@link DataRequest#requestData} (ECIES).
     *
     * @returns {object} object with data or empty object if was error.
     */
    public decryptMessage(senderPk: string, encrypted: string): any {
        const decrypted = this.decrypt.decryptMessage(senderPk, encrypted);
        try {
            return JSON.parse(decrypted);
        } catch (e) {
            console.log(decrypted, e);
            return {};
        }
    }

    private getEncryptedDataForFields(recipientPk: string, fields?: Array<string>): string {
        let encryptedMessage = '';

        if (fields != null && fields.length > 0) {
            const resultMap: Map<string, string> = new Map();
            fields.forEach(value => {
                resultMap.set(value, this.encrypt.generatePasswordForFiled(value.toLowerCase()));
            });

            const jsonMap: any = JsonUtils.mapToJson(resultMap);
            encryptedMessage = this.encrypt
                .encryptMessage(recipientPk, JSON.stringify(jsonMap));
        }

        return encryptedMessage;
    }

    private onChangeAccount(account: Account) {
        this.account = account;
    }

}
