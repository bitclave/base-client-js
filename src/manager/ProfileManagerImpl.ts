import { Observable } from 'rxjs/Rx';
import { ClientDataRepository } from '../repository/client/ClientDataRepository';
import Account from '../repository/models/Account';
import { DataRequest } from '../repository/models/DataRequest';
import { FileMeta } from '../repository/models/FileMeta';
import { BasicLogger, Logger } from '../utils/BasicLogger';
import { JsonUtils } from '../utils/JsonUtils';
import { AcceptedField } from '../utils/keypair/AcceptedField';
import { MessageDecrypt } from '../utils/keypair/MessageDecrypt';
import { MessageEncrypt } from '../utils/keypair/MessageEncrypt';
import { MessageSigner } from '../utils/keypair/MessageSigner';
import { AccessRight } from '../utils/keypair/Permissions';
import { ProfileManager } from './ProfileManager';

export class ProfileManagerImpl implements ProfileManager {

    private clientDataRepository: ClientDataRepository;
    private account: Account = new Account();
    private encrypt: MessageEncrypt;
    private decrypt: MessageDecrypt;
    private signer: MessageSigner;
    private logger: Logger;

    constructor(
        clientRepository: ClientDataRepository,
        authAccountBehavior: Observable<Account>,
        encrypt: MessageEncrypt,
        decrypt: MessageDecrypt,
        signer: MessageSigner,
        loggerService?: Logger
    ) {
        this.clientDataRepository = clientRepository;

        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));

        this.encrypt = encrypt;
        this.decrypt = decrypt;
        this.signer = signer;

        if (!loggerService) {
            loggerService = new BasicLogger();
        }

        this.logger = loggerService;
    }

    public signMessage(data: string): Promise<string> {
        return this.signer.signMessage(data);
    }

    /**
     * Returns decrypted data of the authorized user.
     * @param {string | Array<string>} fieldKey is optional argument. get only requested keys.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */

    public async getData(fieldKey?: string | Array<string>): Promise<Map<string, string>> {
        if (
            this.account == null ||
            this.account.publicKey == null ||
            this.account.publicKey === undefined ||
            this.account.publicKey.length < 1) {
            this.logger.error(`publicKey is not  found in base-client-js`);
            throw new Error('publicKey can not find');
        }
        try {
            const rawData = await this.getRawData(this.account.publicKey, fieldKey);
            return await this.decrypt.decryptFields(rawData);

        } catch (err) {
            this.logger.error(`base-client-js:getData ${JSON.stringify(err)}`);
            throw err;
        }
    }

    /**
     * Returns raw (encrypted) data of user with provided ID (Public Key).
     * @param {string} anyPublicKey Public key of client.
     * @param {string | Array<string>} fieldKey is optional argument. get only requested keys.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    public getRawData(
        anyPublicKey: string,
        fieldKey?: string | Array<string>
    ): Promise<Map<string, string>> {
        return this.clientDataRepository.getData(anyPublicKey, fieldKey);
    }

    /**
     * Decrypts accepted personal data {@link DataRequest#responseData}.
     * @param {Array<DataRequest>} acceptedRequests is array {@link DataRequest}
     * with accepted encrypted data {@link DataRequest#responseData}.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    public async getAuthorizedData(acceptedRequests: Array<DataRequest>): Promise<Map<string, string>> {
        const passForFields = await this.getAuthorizedEncryptionKeys(acceptedRequests);

        if (acceptedRequests.length > 0 && passForFields.size > 0) {

            const recipientData: Map<string, string> = await this.getRawData(
                acceptedRequests[0].rootPk,
                Array.from(passForFields.keys())
            );

            return this.decrypt.decryptFields(recipientData, passForFields);
        }

        return new Map();
    }

    /**
     * Returns decryption keys for approved personal data {@link DataRequest#responseData}.
     * @param {Array<DataRequest>} acceptedRequests is array {@link DataRequest}
     * with accepted encrypted data {@link DataRequest#responseData}.
     *
     * @returns {Promise<Map<string, string>>} Map key (fieldName) => value (Password).
     */
    public async getAuthorizedEncryptionKeys(acceptedRequests: Array<DataRequest>): Promise<Map<string, string>> {
        const result: Map<string, string> = new Map<string, string>();

        for (const data of acceptedRequests) {
            const isDeprecated = !data.rootPk || data.rootPk.length === 0;
            const strDecrypt = await this.decrypt.decryptMessage(data.toPk, data.responseData);

            if (isDeprecated) { // for Backward compatibility of deprecated data
                const jsonDecrypt = JSON.parse(strDecrypt);
                const arrayResponse: Map<string, AcceptedField> = JsonUtils.jsonToMap(jsonDecrypt);

                arrayResponse.forEach((value: AcceptedField, key: string) => result.set(key, value.pass));

            } else {
                try {
                    const field = Object.assign(new AcceptedField('', AccessRight.R), JSON.parse(strDecrypt));
                    result.set(data.requestData, field.pass);

                } catch (e) {
                    console.warn(`error parse obj ${strDecrypt}`);
                }
            }
        }

        return result;
    }

    /**
     * Encrypts and stores personal data in BASE.
     * @param {Map<string, string>} data not encrypted data e.g. Map {"name": "Adam"} etc.
     *
     * @returns {Promise<Map<string, string>>} Map with encrypted data.
     */
    public updateData(data: Map<string, string>): Promise<Map<string, string>> {
        return this.encrypt.encryptFields(data)
            .then(encrypted => this.clientDataRepository.updateData(this.account.publicKey, encrypted));
    }

    /**
     * Encrypts and stores file in BASE.
     * @param {string} file the actual file data encoded to Base64.
     * @param {String} key the key of FileMeta value in profile data.
     * If the fileId is undefined, creates a new file, added associated FileMeta to Profile data with the key and
     *     returns FileMeta.  If not then updates the existing file and its FileMeta in Profile data and returns
     *     updated FileMeta
     *
     * @returns {Promise<FileMeta>} Encrypted FileMeta.
     */
    public async uploadFile(file: FileMeta, key: string): Promise<FileMeta> {
        const encrypted: string = await this.encrypt.encryptFile(file.content || '', key);
        const existedMeta = await this.getFileMetaWithGivenKey(key);
        const fileId: number = existedMeta ? existedMeta.id : 0;
        const fileForUpload = file.copy({content: encrypted});
        const updatedMeta = await this.clientDataRepository
            .uploadFile(this.account.publicKey, fileForUpload, fileId);

        return await this.updateFileMetaWithGivenKey(key, updatedMeta);

    }

    /**
     * Returns decrypted Base64 data of the authorized user based on provided file id.
     * @param {number} id not encrypted file id.
     * @param {String} key the key of FileMeta value in profile data.
     * @param {String} publicKey the public key (id) of user. Optional. default will used origin user.
     * @param {String} existedPassword optional if you already have password for file. apply password instead
     * auto-generation password.
     *
     * @returns {Promise<string>} decrypted file Base64 data.
     */
    public async downloadFile(id: number, key: string, publicKey?: string, existedPassword?: string): Promise<string> {
        const pk = publicKey ? publicKey : this.account.publicKey;
        const encodedFile = await this.clientDataRepository.getFile(pk, id);

        return await this.decrypt.decryptFile(encodedFile, key, existedPassword);
    }

    public async getFileMetaWithGivenKey(key: string): Promise<FileMeta | undefined> {
        const myData: Map<string, string> = await this.getData(key);
        let fileMeta: FileMeta | undefined;
        if (myData.has(key)) {
            const meta: string = myData.get(key) || '';
            fileMeta = FileMeta.fromJson(JSON.parse(meta));
        }

        return fileMeta;
    }

    private async updateFileMetaWithGivenKey(key: string, fileMeta: FileMeta): Promise<FileMeta> {
        const myData: Map<string, string> = await this.getData();
        myData.set(key, JSON.stringify(fileMeta.toJson()));
        await this.updateData(myData);
        return fileMeta;
    }

    private onChangeAccount(account: Account) {
        this.account = account;
    }
}
