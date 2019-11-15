import { Observable } from 'rxjs/Rx';
import { ClientDataRepository } from '../repository/client/ClientDataRepository';
import Account from '../repository/models/Account';
import { DataRequest } from '../repository/models/DataRequest';
import { FileMeta } from '../repository/models/FileMeta';
import { SharedData } from '../repository/models/SharedData';
import { Logger } from '../utils/BasicLogger';
import { MessageDecrypt } from '../utils/keypair/MessageDecrypt';
import { MessageEncrypt } from '../utils/keypair/MessageEncrypt';
import { MessageSigner } from '../utils/keypair/MessageSigner';
import { ProfileManager } from './ProfileManager';
export declare class ProfileManagerImpl implements ProfileManager {
    private clientDataRepository;
    private account;
    private encrypt;
    private decrypt;
    private signer;
    private logger;
    constructor(clientRepository: ClientDataRepository, authAccountBehavior: Observable<Account>, encrypt: MessageEncrypt, decrypt: MessageDecrypt, signer: MessageSigner, loggerService?: Logger);
    signMessage(data: string): Promise<string>;
    decryptMessage(senderPk: string, encryptedMessage: string): Promise<string>;
    encryptMessage(recipientPk: string, message: string): Promise<string>;
    /**
     * Returns decrypted data of the authorized user.
     * @param {string | Array<string>} fieldKey is optional argument. get only requested keys.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    getData(fieldKey?: string | Array<string>): Promise<Map<string, string>>;
    /**
     * Returns raw (encrypted) data of user with provided ID (Public Key).
     * @param {string} anyPublicKey Public key of client.
     * @param {string | Array<string>} fieldKey is optional argument. get only requested keys.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    getRawData(anyPublicKey: string, fieldKey?: string | Array<string>): Promise<Map<string, string>>;
    /**
     * Decrypts accepted personal data {@link DataRequest#responseData}.
     * @param {Array<DataRequest>} acceptedRequests is array {@link DataRequest}
     * with accepted encrypted data {@link DataRequest#responseData}.
     *
     * @returns {Promise<SharedData>}  sharedData->DataRequest-> responseData is client value or undefined if not
     * have access
     */
    getAuthorizedData(acceptedRequests: Array<DataRequest>): Promise<SharedData>;
    /**
     * Returns decryption keys for approved personal data {@link DataRequest#responseData}.
     * @param {Array<DataRequest>} acceptedRequests is array {@link DataRequest}
     * with accepted encrypted data {@link DataRequest#responseData}.
     *
     * @returns {Promise<SharedData>} sharedData->DataRequest-> responseData is Password.
     */
    getAuthorizedEncryptionKeys(acceptedRequests: Array<DataRequest>): Promise<SharedData>;
    /**
     * Encrypts and stores personal data in BASE.
     * @param {Map<string, string>} data not encrypted data e.g. Map {"name": "Adam"} etc.
     *
     * @returns {Promise<Map<string, string>>} Map with encrypted data.
     */
    updateData(data: Map<string, string>): Promise<Map<string, string>>;
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
    uploadFile(file: FileMeta, key: string): Promise<FileMeta>;
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
    downloadFile(id: number, key: string, publicKey?: string, existedPassword?: string): Promise<string>;
    getFileMetaWithGivenKey(key: string): Promise<FileMeta | undefined>;
    private updateFileMetaWithGivenKey;
    private onChangeAccount;
}
