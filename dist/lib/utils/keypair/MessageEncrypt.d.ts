import { AccessRight } from './Permissions';
export interface MessageEncrypt {
    encryptMessage(recipientPk: string, message: string): Promise<string>;
    encryptFields(fields: Map<string, string>): Promise<Map<string, string>>;
    encryptPermissionsFields(recipient: string, data: Map<string, AccessRight>): Promise<string>;
    encryptFieldsWithPermissions(recipient: string, data: Map<string, AccessRight>): Promise<Map<string, string>>;
    encryptFile(file: string, fieldName: string): Promise<string>;
}
