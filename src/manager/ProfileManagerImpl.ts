import { Observable } from 'rxjs';
import { ClientDataRepository } from '../repository/client/ClientDataRepository';
import Account from '../repository/models/Account';
import { DataRequest } from '../repository/models/DataRequest';
import { FieldData } from '../repository/models/FieldData';
import { FileMeta } from '../repository/models/FileMeta';
import { JsonObject } from '../repository/models/JsonObject';
import { SharedData } from '../repository/models/SharedData';
import { BasicLogger, Logger } from '../utils/BasicLogger';
import { ExportMethod } from '../utils/ExportMethod';
import { JsonUtils } from '../utils/JsonUtils';
import { AcceptedField } from '../utils/keypair/AcceptedField';
import { MessageDecrypt } from '../utils/keypair/MessageDecrypt';
import { MessageEncrypt } from '../utils/keypair/MessageEncrypt';
import { MessageSigner } from '../utils/keypair/MessageSigner';
import { AccessRight } from '../utils/keypair/Permissions';
import { TimeMeasureLogger } from '../utils/TimeMeasureLogger';
import { ParamDeserializer } from '../utils/types/json-transform';
import { ArrayDeserializer } from '../utils/types/json-transform';
import { SimpleMapDeserializer } from '../utils/types/json-transform';
import { ProfileManager } from './ProfileManager';

export class ProfileManagerImpl implements ProfileManager {

    private account: Account = new Account();
    private logger: Logger;

    constructor(
        private readonly clientDataRepository: ClientDataRepository,
        authAccountBehavior: Observable<Account>,
        private readonly encrypt: MessageEncrypt,
        private readonly decrypt: MessageDecrypt,
        private readonly signer: MessageSigner,
        loggerService?: Logger
    ) {

        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));

        if (!loggerService) {
            loggerService = new BasicLogger();
        }

        this.logger = loggerService;
    }

    @ExportMethod()
    public signMessage(data: string): Promise<string> {
        return this.signer.signMessage(data);
    }

    @ExportMethod()
    public decryptMessage(senderPk: string, encryptedMessage: string): Promise<string> {
        return this.decrypt.decryptMessage(senderPk, encryptedMessage);
    }

    @ExportMethod()
    public encryptMessage(recipientPk: string, message: string): Promise<string> {
        return this.encrypt.encryptMessage(recipientPk, message);
    }

    /**
     * Returns decrypted data of the authorized user.
     * @param {string | Array<string>} fieldKey is optional argument. get only requested keys.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    @ExportMethod()
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
    @ExportMethod()
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
     * @returns {Promise<SharedData>}  sharedData->DataRequest-> responseData is client value or undefined if not
     * have access
     */
    @ExportMethod()
    public async getAuthorizedData(
        @ParamDeserializer(new ArrayDeserializer(DataRequest)) acceptedRequests: Array<DataRequest>
    ): Promise<SharedData> {
        if (!acceptedRequests || acceptedRequests.length <= 0) {
            return new SharedData();
        }

        const sharedData = await this.getAuthorizedEncryptionKeys(acceptedRequests);

        if (sharedData.size > 0) {
            for (const [root, fields] of sharedData.extractKeysByRoot()) {
                const clientKeys: Array<string> = Array.from(fields.keys());
                const recipientData: Map<string, string> = await this.getRawData(root, clientKeys);
                const mapKeyToPass: Map<string, string> = new Map();
                fields.forEach((data, key) => {
                    if (data.value) {
                        mapKeyToPass.set(key, data.value);
                    }
                });

                const decryptedFields = await this.decrypt.decryptFields(recipientData, mapKeyToPass);
                decryptedFields.forEach((value, key) => {
                    if (fields.has(key)) {
                        (fields.get(key) as FieldData).value = value;
                    }
                });
            }
        }

        return sharedData;
    }

    /**
     * Returns decryption keys for approved personal data {@link DataRequest#responseData}.
     * @param {Array<DataRequest>} acceptedRequests is array {@link DataRequest}
     * with accepted encrypted data {@link DataRequest#responseData}.
     *
     * @returns {Promise<SharedData>} sharedData->DataRequest-> responseData is Password.
     */
    @ExportMethod()
    public async getAuthorizedEncryptionKeys(
        @ParamDeserializer(new ArrayDeserializer(DataRequest)) acceptedRequests: Array<DataRequest>
    ): Promise<SharedData> {
        const result = new SharedData();

        for (const data of acceptedRequests) {
            const isDeprecated = !data.rootPk || data.rootPk.length === 0;
            let strDecrypt = '';

            try {
                if (data.responseData && data.responseData.length > 0) {
                    strDecrypt = await this.decrypt.decryptMessage(data.toPk, data.responseData);
                }
            } catch (e) {
                console.warn(e);
            }

            if (isDeprecated) { // for Backward compatibility of deprecated data
                try {
                    const strDecryptRequestFields = await this.decrypt.decryptMessage(data.toPk, data.requestData);

                    (JSON.parse(strDecryptRequestFields) as Array<string>)
                        .forEach(value => result.set(new FieldData(data.fromPk, data.toPk, data.toPk, value)));
                } catch (e) {
                    console.warn(e);
                }

                try {
                    const jsonDecrypt = JSON.parse(strDecrypt);
                    const arrayResponse: Map<string, AcceptedField> = JsonUtils.jsonToMap(jsonDecrypt);

                    arrayResponse.forEach((value: AcceptedField, key: string) => {
                        result.set(new FieldData(data.fromPk, data.toPk, data.toPk, key, value.pass));
                    });
                } catch (e) {
                    console.warn(e);
                }

            } else {
                try {
                    const field = Object.assign(new AcceptedField('', AccessRight.R), JSON.parse(strDecrypt));
                    result.set(new FieldData(data.fromPk, data.toPk, data.rootPk, data.requestData, field.pass));

                } catch (e) {
                    result.set(new FieldData(data.fromPk, data.toPk, data.rootPk, data.requestData));
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
    @ExportMethod()
    public async updateData(
        @ParamDeserializer(new SimpleMapDeserializer()) data: Map<string, string>
    ): Promise<Map<string, string>> {
        TimeMeasureLogger.time('updateData-> encryptFields');
        const encryptedFields = await this.encrypt.encryptFields(data);
        TimeMeasureLogger.timeEnd('updateData-> encryptFields');

        TimeMeasureLogger.time('updateData-> updateData');
        const result = await this.clientDataRepository.updateData(this.account.publicKey, encryptedFields);
        TimeMeasureLogger.timeEnd('updateData-> updateData');

        return result;
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
    @ExportMethod()
    public async uploadFile(@ParamDeserializer(FileMeta) file: FileMeta, key: string): Promise<FileMeta> {
        const encrypted: string = await this.encrypt.encryptFile(file.content || '', key);
        const existedMeta = await this.getFileMetaWithGivenKey(key);
        const fileId: number = existedMeta ? existedMeta.id : 0;
        const fileForUpload = file.copy({content: encrypted} as JsonObject<FileMeta>);
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
    @ExportMethod()
    public async downloadFile(id: number, key: string, publicKey?: string, existedPassword?: string): Promise<string> {
        const pk = publicKey ? publicKey : this.account.publicKey;
        const encodedFile = await this.clientDataRepository.getFile(pk, id);

        return await this.decrypt.decryptFile(encodedFile, key, existedPassword);
    }

    @ExportMethod()
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
