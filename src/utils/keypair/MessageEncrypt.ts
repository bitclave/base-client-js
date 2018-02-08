export interface MessageEncrypt {

    encryptMessage(recipientPk: string, message: string) : string;

    generatePasswordForFiled(fieldName: String): string;

}
