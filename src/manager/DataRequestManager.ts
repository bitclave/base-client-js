import { DataRequestRepository } from '../repository/requests/DataRequestRepository';
import { MessageEncrypt } from '../utils/keypair/MessageEncrypt';
import { MessageDecrypt } from '../utils/keypair/MessageDecrypt';
import { JsonUtils } from '../utils/JsonUtils';
import DataRequest from '../repository/models/DataRequest';
import Account from '../repository/models/Account';
import { Observable } from 'rxjs/Rx';

export class DataRequestManager {

    private account: Account;
    private dataRequestRepository: DataRequestRepository;
    private encrypt: MessageEncrypt;
    private decrypt: MessageDecrypt;

    constructor(dataRequestRepository: DataRequestRepository,
                authAccountBehavior: Observable<Account>,
                encrypt: MessageEncrypt,
                decrypt: MessageDecrypt) {
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
    public async requestPermissions(recipientPk: string, fields: Array<string>): Promise<number> {
        return this.encrypt
            .encryptMessage(recipientPk, JSON.stringify(fields).toLowerCase())
            .then((encrypted: string) => this.dataRequestRepository.requestPermissions(recipientPk, encrypted));
    }

    /**
     * Returns a list of outstanding data access requests, where data access requests meet the provided search criteria.
     * @param {string} fromPk (Optional if toPk exist.) public key of the user that issued data access request.
     * @param {string} toPk (Optional if fromPk exist.) public key of the user that is expected to.
     *
     * @returns {Promise<Array<DataRequest>>}  List of {@link DataRequest}, or empty list
     */
    public getRequests(fromPk: string = '', toPk: string = ''): Promise<Array<DataRequest>> {
        return this.dataRequestRepository.getRequests(fromPk, toPk);
    }

    /**
     * Grant access data for client.
     * @param {string} clientPk id of client.
     * @param {Map<string, string>} acceptedFields. Arrays names of fields for accept access.
     * (e.g. this is keys in {Map<string, string>} - personal data).
     *
     * @returns {Promise<number>}
     */
    public async grantAccessForClient(clientPk: string, acceptedFields: Array<string>): Promise<number> {
        const encrypted: string = await this.getEncryptedDataForFields(clientPk, acceptedFields);

        return await this.dataRequestRepository.grantAccessForClient(clientPk, this.account.publicKey, encrypted);
    }

    /**
     * Returns the list of permissions requested from the client
     * @param {string} requestedFromPk The public key of the client whose permission is requested
     * @returns {Promise<Array<string>>} list with names of fields.
     */
    public async getRequestedPermissions(requestedFromPk: string): Promise<Array<string>> {
        const requests = await this.getRequests(this.account.publicKey, requestedFromPk);
        if (requests.length > 0) {
            const strDecrypt: string = await this.decrypt.decryptMessage(requestedFromPk, requests[0].requestData);

            return JSON.parse(strDecrypt);

        } else {
            return [];
        }
    }

    /**
     * Returns the list of permissions requested from the client
     * @param {string} whoRequestedPk The public key of the client whose permission is requested
     * @returns {Promise<Array<string>>} list with names of fields.
     */
    public async getRequestedPermissionsToMe(whoRequestedPk: string): Promise<Array<string>> {
        const requests = await this.getRequests(whoRequestedPk, this.account.publicKey);
        if (requests.length > 0) {
            const strDecrypt: string = await this.decrypt.decryptMessage(whoRequestedPk, requests[0].requestData);

            return JSON.parse(strDecrypt);

        } else {
            return [];
        }
    }

    /**
     * Returns the list of permissions granted to the client
     * @param {string} clientPk the public key of the client that was given permission.
     * @returns {Promise<Array<string>>} list with names of fields.
     */
    public async getGrantedPermissions(clientPk: string): Promise<Array<string>> {
        const requests = await this.getRequests(this.account.publicKey, clientPk);
        if (requests.length > 0) {
            const strDecrypt: string = await this.decrypt.decryptMessage(clientPk, requests[0].responseData);
            const jsonDecrypt: any = JSON.parse(strDecrypt);
            const mapResponse: Map<string, string> = JsonUtils.jsonToMap(jsonDecrypt);
            return Array.from(mapResponse.keys());

        } else {
            return [];
        }
    }

    /**
     * Returns the list of permissions granted to the client
     * @param {string} clientPk the public key of the client that was given permission.
     * @returns {Promise<Array<string>>} list with names of fields.
     */
    public async getGrantedPermissionsToMe(clientPk: string): Promise<Array<string>> {
        const requests = await this.getRequests(clientPk, this.account.publicKey);
        if (requests.length > 0) {
            const strDecrypt: string = await this.decrypt.decryptMessage(clientPk, requests[0].responseData);
            const jsonDecrypt: any = JSON.parse(strDecrypt);
            const mapResponse: Map<string, string> = JsonUtils.jsonToMap(jsonDecrypt);
            return Array.from(mapResponse.keys());

        } else {
            return [];
        }
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
        return this.getEncryptedDataForFields(offerOwner, acceptedFields)
            .then(encrypted => this.dataRequestRepository.grantAccessForOffer(
                offerId,
                this.account.publicKey,
                encrypted
            ));
    }

    /**
     * Decodes a message that was encrypted by the owner of the private key that matches the provided public key.
     * @param {string} senderPk public key of the user that issued data access request.
     * @param {string} encrypted encrypted data from {@link DataRequest#requestData} (ECIES).
     *
     * @returns {object | null} object with data or null if was error.
     */
    public decryptMessage(senderPk: string, encrypted: string): Promise<any> {
        return this.decrypt.decryptMessage(senderPk, encrypted)
            .then(decrypted => {
                try {
                    return JSON.parse(decrypted);
                } catch (e) {
                    return decrypted;
                }
            }).catch(reason => encrypted);
    }

    private async getEncryptedDataForFields(recipientPk: string, fields?: Array<string>): Promise<string> {
        let encryptedMessage = '';

        if (fields != null && fields.length > 0) {
            const resultMap: Map<string, string> = new Map();

            for (let value of fields) {
                resultMap.set(value, await this.encrypt.generatePasswordForField(value.toLowerCase()));
            }

            const jsonMap: any = JsonUtils.mapToJson(resultMap);
            encryptedMessage = await this.encrypt.encryptMessage(recipientPk, JSON.stringify(jsonMap));
        }

        return encryptedMessage;
    }

    private onChangeAccount(account: Account) {
        this.account = account;
    }

}
