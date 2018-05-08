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
     * Grants access to specific fields of my data to a client.
     * @param {string} clientPk id (baseID) of the client that is authorized for data access.
     * @param {Map<string, string>} acceptedFields. Array of field names that are authorized for access
     * (e.g. these are keys in {Map<string, string>} - personal data).
     *
     * @returns {Promise<number>}
     */
    public async grantAccessForClient(clientPk: string, acceptedFields: Array<string>): Promise<number> {
        const encrypted: string = await this.getEncryptedDataForFields(clientPk, acceptedFields);

        return await this.dataRequestRepository.grantAccessForClient(clientPk, this.account.publicKey, encrypted);
    }

    /**
     * Returns list of fields requested for access by <me> from the client
     * @param {string} requestedFromPk id (baseID) of the client whose permissions were requested
     * @returns {Promise<Array<string>>} Array of field names that were requested for access
     */
    public async getRequestedPermissions(requestedFromPk: string): Promise<Array<string>> {
        const requests = await this.getRequests(this.account.publicKey, requestedFromPk);
        return await this.decodeRequestedPermissions(requests, requestedFromPk);
    }

    /**
     * Returns list of fields requested for access by the client from <me>
     * @param {string} whoRequestedPk id (baseID) of the client that asked for permission from <me>
     * @returns {Promise<Array<string>>} Array of field names that were requested for access
     */
    public async getRequestedPermissionsToMe(whoRequestedPk: string): Promise<Array<string>> {
        const requests = await this.getRequests(whoRequestedPk, this.account.publicKey);
        return await this.decodeRequestedPermissions(requests, whoRequestedPk);
    }

    /**
     * Returns list of fields that <client> authorized <me> to access
     * @param {string} clientPk id (baseID) of the client that granted me permission.
     * @returns {Promise<Array<string>>} Array of field names that were authorized for access
     */
    public async getGrantedPermissions(clientPk: string): Promise<Array<string>> {
        const requests = await this.getRequests(this.account.publicKey, clientPk);
        return await this.getDecodeGrantPermissions(requests, clientPk);
    }

    /**
     * Returns list of fields that <me> authorized <client> to access
     * @param {string} clientPk id (baseID) of the client that received access permission from <me>
     * @returns {Promise<Array<string>>} Array of field names that were authorized for access
     */
    public async getGrantedPermissionsToMe(clientPk: string): Promise<Array<string>> {
        const requests = await this.getRequests(clientPk, this.account.publicKey);
        return await this.getDecodeGrantPermissions(requests, clientPk);
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

    private async decodeRequestedPermissions(requests: Array<DataRequest>, clientPk: string): Promise<Array<string>> {
        if (requests.length > 0 && requests[0].requestData.trim().length > 0) {
            try {
                const strDecrypt: string = await this.decrypt.decryptMessage(clientPk, requests[0].requestData);

                return JSON.parse(strDecrypt);

            } catch (e) {
                return [];
            }
        } else {
            return [];
        }
    }

    private async getDecodeGrantPermissions(requests: Array<DataRequest>, clientPk: string): Promise<Array<string>> {
        if (requests.length > 0 && requests[0].responseData.trim().length > 0) {
            const strDecrypt: string = await this.decrypt.decryptMessage(clientPk, requests[0].responseData);
            const jsonDecrypt: any = JSON.parse(strDecrypt);
            const mapResponse: Map<string, string> = JsonUtils.jsonToMap(jsonDecrypt);

            return Array.from(mapResponse.keys());

        } else {
            return [];
        }
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
