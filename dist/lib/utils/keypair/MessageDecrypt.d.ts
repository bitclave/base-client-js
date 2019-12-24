export interface MessageDecrypt {
    decryptMessage(senderPk: string, encrypted: string): Promise<string>;
    decryptFields(fields: Map<string, string>, passwords?: Map<string, string>): Promise<Map<string, string>>;
    /**
     * Decrypt file. Base64 string
     *
     * @param {string} file base64 encrypted data
     * @param {string} filedName key of field for auto-generation password for decrypt
     * @param {string} password optional if you already have password for file. apply password instead
     * auto-generation password.
     *
     * @returns {Promise<string>} decrypted file Base64 data.
     */
    decryptFile(file: string, filedName: string, password?: string): Promise<string>;
}
