export default class PermissionModel {

    from: string;
    to: string;
    requestFields: Array<string>;
    responseFields: Array<string>;
    decryptedFields: Map<string, string>;
    accountPublicKey: string;

    constructor(from: string,
                to: string,
                requestFields: Array<string>,
                responseFields: Array<string>,
                decryptedFields: Map<string, string>,
                accountPublicKey: string) {
        this.from = from;
        this.to = to;
        this.requestFields = requestFields;
        this.responseFields = responseFields;
        this.decryptedFields = decryptedFields;
        this.accountPublicKey = accountPublicKey;
    }

}
