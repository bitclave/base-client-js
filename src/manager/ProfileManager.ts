import FileMeta from '../repository/models/FileMeta';

export interface ProfileManager {

    signMessage(data: string): Promise<string>;

    /**
     * Returns decrypted data of the authorized user.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    getData(): Promise<Map<string, string>>;

    /**
     * Returns raw (encrypted) data of user with provided ID (Public Key).
     * @param {string} anyPublicKey Public key of client.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    getRawData(anyPublicKey: string): Promise<Map<string, string>>;

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
     * @returns {Promise<Map<string, string>>} Map key => value.
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
     * Returns decrypted file blob data of the authorized user based on provided file id.
     * @param {number} id not encrypted file id
     *
     * @returns {Promise<File>} decrypted file blob data.
     */
    downloadFile(id: number): Promise<FileMeta>;

    /**
     * Returns given key's decrypted value of authorized user's data.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    getFileMetaWithGivenKey(key: string): Promise<FileMeta | undefined>;

}
