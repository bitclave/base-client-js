import { FileMeta } from '../repository/models/FileMeta';

export interface ProfileManager {

    signMessage(data: string): Promise<string>;

    encryptMessage(recipientPk: string, message: string): Promise<string>;

    decryptMessage(senderPk: string, encryptedMessage: string): Promise<string>;

    /**
     * Returns decrypted data of the authorized user.
     * @param {fieldKey: string | Array<string>} fieldKey is optional argument. get only requested keys.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    getData(fieldKey?: string | Array<string>): Promise<Map<string, string>>;

    /**
     * Returns raw (encrypted) data of user with provided ID (Public Key).
     * @param {string} anyPublicKey Public key of client.
     * @param {fieldKey: string | Array<string>} fieldKey is optional argument. get only requested keys.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    getRawData(anyPublicKey: string, fieldKey?: string | Array<string>): Promise<Map<string, string>>;

    /**
     * Decrypts accepted personal data {@link DataRequest#responseData}.
     * @param {string} recipientPk  Public key of the user that shared the data
     * @param {string} encryptedData encrypted data {@link DataRequest#responseData}.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    getAuthorizedData(recipientPk: string, encryptedData: string): Promise<Map<string, string>>;

    /**
     * Returns decryption keys for approved personal data {@link DataRequest#responseData}.
     * @param {string} recipientPk  Public key of the user that shared the data
     * @param {string} encryptedData encrypted data {@link DataRequest#responseData}.
     *
     * @returns {Promise<Map<string, string>>} Map key (fieldName) => value (Password).
     */
    getAuthorizedEncryptionKeys(recipientPk: string, encryptedData: string): Promise<Map<string, string>>;

    /**
     * Encrypts and stores personal data in BASE.
     * @param {Map<string, string>} data not encrypted data e.g. Map {"name": "Adam"} etc.
     *
     * @returns {Promise<Map<string, string>>} Map with encrypted data.
     */
    updateData(data: Map<string, string>): Promise<Map<string, string>>;

    /**
     * Encrypts and stores file in BASE.
     * @param {FileMeta} file the actual file information
     * @param {String} key the key of FileMeta value in profile data
     * If the value of the key is undefined, creates a new file, added associated FileMeta to Profile data with the key
     *     and returns FileMeta. If not then updates the existing file and its FileMeta in Profile data and returns
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

    /**
     * Returns given key's decrypted value of authorized user's data.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    getFileMetaWithGivenKey(key: string): Promise<FileMeta | undefined>;

}
