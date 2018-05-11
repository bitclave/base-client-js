export interface MessageDecrypt {

    decryptMessage(senderPk: string, encrypted: string): Promise<string>;

    decryptFields(fields: Map<string, string>): Promise<Map<string, string>>;

}
