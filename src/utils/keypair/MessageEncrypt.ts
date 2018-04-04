export interface MessageEncrypt {

    encryptMessage(recipientPk: string, message: string): string;

    generatePasswordForField(fieldName: String): string;

}
