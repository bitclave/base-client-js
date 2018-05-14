export interface ProfileManager {

    signMessage(data: any): Promise<string>

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

}
