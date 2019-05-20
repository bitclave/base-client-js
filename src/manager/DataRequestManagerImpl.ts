import { Observable } from 'rxjs/Rx';
import Account from '../repository/models/Account';
import { DataRequest } from '../repository/models/DataRequest';
import { FieldData } from '../repository/models/FieldData';
import { SharedData } from '../repository/models/SharedData';
import { DataRequestRepository } from '../repository/requests/DataRequestRepository';
import { JsonUtils } from '../utils/JsonUtils';
import { AcceptedField } from '../utils/keypair/AcceptedField';
import { MessageDecrypt } from '../utils/keypair/MessageDecrypt';
import { MessageEncrypt } from '../utils/keypair/MessageEncrypt';
import { AccessRight } from '../utils/keypair/Permissions';
import { DataRequestManager } from './DataRequestManager';
import { WalletManagerImpl } from './WalletManagerImpl';

export class DataRequestManagerImpl implements DataRequestManager {

    private account: Account;
    private dataRequestRepository: DataRequestRepository;
    private encrypt: MessageEncrypt;
    private decrypt: MessageDecrypt;

    constructor(
        dataRequestRepository: DataRequestRepository,
        authAccountBehavior: Observable<Account>,
        encrypt: MessageEncrypt,
        decrypt: MessageDecrypt
    ) {
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
     * @returns {Promise<void>}
     */
    public async requestPermissions(recipientPk: string, fields: Array<string>): Promise<void> {
        const requestDataList = fields
            .map(item => new DataRequest(this.account.publicKey, recipientPk, recipientPk, item.toLowerCase(), ''));

        return this.dataRequestRepository.requestPermissions(recipientPk, requestDataList);
    }

    /**
     * Returns a list of outstanding data access requests, where data access requests meet the provided search criteria.
     * @param {string} fromPk (Optional if toPk exist.) public key of the user that issued data access request.
     * @param {string} toPk (Optional if fromPk exist.) public key of the user that is expected to.
     *
     * @returns {Promise<Array<DataRequest>>}  List of {@link DataRequest}, or empty list
     */
    public getRequests(fromPk: string | null, toPk: string | null): Promise<Array<DataRequest>> {
        return this.dataRequestRepository.getRequests(fromPk, toPk);
    }

    /**
     * Grants access to specific fields of my data to a client.
     * @param {string} clientPk id (baseID) of the client that is authorized for data access.
     * @param {Map<string, AccessRight>} acceptedFields. Array of field names that are authorized for access
     * (e.g. these are keys in {Map<string, string>} - personal data).
     * @param {string} rootPk ID (baseID) of the client that is the data owner.
     *
     * @returns {Promise<void>}
     */
    public async grantAccessForClient(
        clientPk: string,
        acceptedFields: Map<string, AccessRight>,
        rootPk?: string,
    ): Promise<void> {
        let encrypted: Map<string, string> = new Map();
        rootPk = rootPk ? rootPk : this.account.publicKey;

        if (rootPk === this.account.publicKey) {
            encrypted = await this.encrypt.encryptFieldsWithPermissions(
                clientPk,
                acceptedFields
            );
        } else {
            encrypted = await this.encryptGrantedFields(
                clientPk,
                rootPk,
                new Set(acceptedFields.keys())
            );
        }

        const requestDataList: Array<DataRequest> = [];

        for (const [key, value] of encrypted.entries()) {
            requestDataList.push(
                new DataRequest(
                    clientPk,
                    this.account.publicKey,
                    rootPk,
                    key.toLowerCase(),
                    value
                )
            );
        }

        return await this.dataRequestRepository.grantAccessForClient(requestDataList);
    }

    /**
     * revoke access to specific fields of my data to a client.
     * @param {string} clientPk id (baseID) of the client that is authorized for data access.
     * @param {Array<string>} revokeFields. Array of field names that are authorized for access
     * (e.g. these are keys in {Map<string, string>} - personal data).
     *
     * @returns {Promise<void>}
     */
    public async revokeAccessForClient(clientPk: string, revokeFields: Array<string>): Promise<void> {
        const requestDataList = revokeFields.map(item =>
            new DataRequest(
                clientPk,
                this.account.publicKey,
                this.account.publicKey,
                item.toLowerCase(),
                ''
            ));

        return this.dataRequestRepository.revokeAccessForClient(requestDataList);
    }

    /**
     * Returns list of fields requested for access by <me> from the client
     * @param {string} requestedFromPk id (baseID) of the client whose permissions were requested. is optional.
     * @returns {Promise<Array<string>>} Array of field names that were requested for access
     */
    public async getRequestedPermissions(requestedFromPk?: string | undefined): Promise<Array<FieldData>> {
        const requests = await this.getRequests(this.account.publicKey, requestedFromPk || null);
        const shared = await this.decodeRequestedPermissions(requests, true);

        return requestedFromPk ? shared.getDataTo(requestedFromPk) : shared.toList();
    }

    /**
     * Returns list of fields requested for access by the client from <me>
     * @param {string} whoRequestedPk id (baseID) of the client that asked for permission from <me>. is optional.
     * @returns {Promise<Array<string>>} Array of field names that were requested for access
     */
    public async getRequestedPermissionsToMe(whoRequestedPk?: string | undefined): Promise<Array<FieldData>> {
        const requests = await this.getRequests(whoRequestedPk || null, this.account.publicKey);
        const shared = await this.decodeRequestedPermissions(requests, false);

        return whoRequestedPk ? shared.getDataTo(this.account.publicKey) : shared.toList();
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
     * @deprecated
     *
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
     * @param {number} offerSearchId id of item search result {@link OfferSearch} and {@link OfferSearchResultItem}.
     * @param {string} offerOwner Public key of offer owner.
     * @param {Map<string, AccessRight>} acceptedFields. Map with names of fields for accept access and access rights.
     * (e.g. this is keys in {Map<string, string>} - personal data).
     *
     * @returns {Promise<void>}
     */
    public grantAccessForOffer(
        offerSearchId: number,
        offerOwner: string,
        acceptedFields: Map<string, AccessRight>,
        priceId: number
    ): Promise<void> {

        // automatically grant access to WalletManagerImpl.DATA_KEY_CRYPTO_WALLETS
        acceptedFields.set(WalletManagerImpl.DATA_KEY_CRYPTO_WALLETS, AccessRight.R);

        return this.encrypt
            .encryptPermissionsFields(offerOwner, acceptedFields)
            .then(encrypted => this.dataRequestRepository.grantAccessForOffer(
                offerSearchId,
                this.account.publicKey,
                encrypted,
                priceId
            ))
            .catch(err => {
                throw err;
            });
    }

    /**
     * Decodes a message that was encrypted by the owner of the private key that matches the provided public key.
     * @param {string} senderPk public key of the user that issued data access request.
     * @param {string} encrypted encrypted data from {@link DataRequest#requestData} (ECIES).
     *
     * @returns {object | null} object with data or null if was error.
     */
    public decryptMessage(senderPk: string, encrypted: string): Promise<object | string> {
        return this.decrypt.decryptMessage(senderPk, encrypted)
            .then(decrypted => {
                try {
                    return JSON.parse(decrypted);
                } catch (e) {
                    return decrypted;
                }
            }).catch(reason => encrypted);
    }

    private async encryptGrantedFields(
        recipientPk: string,
        rootPk: string,
        shareFields: Set<string>
    ): Promise<Map<string, string>> {
        const result: Map<string, string> = new Map();
        const requests = await this.getRequests(this.account.publicKey, null);
        const filtered = requests.filter(item => item.rootPk === rootPk && shareFields.has(item.requestData));
        const availableData = new Map<string, DataRequest>();

        filtered.forEach(item => availableData.set(item.requestData, item));

        for (const data of availableData.values()) {
            const strDecrypt: string = await this.decrypt.decryptMessage(data.toPk, data.responseData);
            const jsonDecrypt = JSON.parse(strDecrypt);
            const acceptedByRoot: AcceptedField = Object.assign(
                new AcceptedField('', AccessRight.R),
                jsonDecrypt
            );

            const accepted = acceptedByRoot.copy({access: AccessRight.R});
            const value = await this.encrypt.encryptMessage(recipientPk, JSON.stringify(accepted));
            result.set(data.requestData, value);
        }

        return result;
    }

    private async decodeRequestedPermissions(requests: Array<DataRequest>, isToPk: boolean): Promise<SharedData> {
        const result: SharedData = new SharedData();

        for (const item of requests) {
            const isDeprecated = !item.rootPk || item.rootPk.length <= 0;
            const ownerPk = isToPk ? item.toPk : item.fromPk;

            if (isDeprecated) {  // for Backward compatibility of deprecated data
                let accepted: Map<string, AcceptedField> = new Map();
                let requested: Set<string> = new Set();

                try {
                    if (item.responseData.length > 0) {
                        const strDecryptRequestFields: string = await this.decrypt
                            .decryptMessage(ownerPk, item.responseData);

                        const jsonDecryptRequestFields = JSON.parse(strDecryptRequestFields);
                        accepted = JsonUtils.jsonToMap(jsonDecryptRequestFields);
                    }
                } catch (e) {
                    console.warn(e);
                }

                try {
                    if (item.requestData.trim().length > 0) {
                        const strDecrypt: string = await this.decrypt.decryptMessage(ownerPk, item.requestData);
                        requested = new Set(JSON.parse(strDecrypt) as Array<string>);
                    }
                } catch (e) {
                    console.warn(e);
                }

                Array.from(requested.keys())
                    .forEach(key => result.set(new FieldData(item.fromPk, item.toPk, item.toPk, key)));

                accepted.forEach((value, key) =>
                    result.set(new FieldData(item.fromPk, item.toPk, item.toPk, key, value.pass))
                );

            } else {
                let value: string | undefined;

                if (item.responseData.length > 0) {
                    try {
                        const strDecrypt: string = await this.decrypt.decryptMessage(ownerPk, item.responseData);
                        const jsonDecrypt = JSON.parse(strDecrypt);

                        const acceptedFiled: AcceptedField = Object.assign(
                            new AcceptedField('', AccessRight.R),
                            jsonDecrypt
                        );

                        if (acceptedFiled.pass && acceptedFiled.pass.length > 0) {
                            value = acceptedFiled.pass;
                        }
                    } catch (e) {
                        console.warn(e);
                    }
                }

                result.set(new FieldData(item.fromPk, item.toPk, item.rootPk, item.requestData, value));
            }
        }

        return result;
    }

    private async getDecodeGrantPermissions(requests: Array<DataRequest>, clientPk: string): Promise<Array<string>> {
        const result: Set<string> = new Set();

        for (const item of requests) {
            if (item.responseData.trim().length > 0) {
                // for Backward compatibility of deprecated data
                const strDecrypt: string = await this.decrypt.decryptMessage(clientPk, item.responseData);
                const jsonDecrypt = JSON.parse(strDecrypt);

                if (!item.rootPk || item.rootPk.length <= 0) {
                    try {
                        const mapResponse: Map<string, string> = JsonUtils.jsonToMap(jsonDecrypt);

                        Array.from(mapResponse.keys())
                            .forEach(value => result.add(value));

                    } catch (e) {
                        console.warn(e);
                    }

                } else {
                    const acceptedFiled: AcceptedField = Object.assign(
                        new AcceptedField('', AccessRight.R),
                        jsonDecrypt
                    );

                    if (acceptedFiled.pass && acceptedFiled.pass.length > 0) {
                        result.add(item.requestData);
                    }
                }
            }
        }

        return Array.from(result.keys());
    }

    private onChangeAccount(account: Account) {
        this.account = account;
    }

}
