import { RpcToken } from './RpcToken';

export default class RpcDecryptEncryptFields extends RpcToken {

    fields: Map<string, string>;

    constructor(accessToken: string, fields: Map<string, string>) {
        super(accessToken);
        this.fields = fields;
    }

}
