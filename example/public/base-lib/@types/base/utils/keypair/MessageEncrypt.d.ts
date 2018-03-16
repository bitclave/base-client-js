export interface MessageEncrypt {
    encryptMessage(recipientPk: string, message: string): Promise<string>;
    generatePasswordForField(fieldName: String): Promise<string>;
}
