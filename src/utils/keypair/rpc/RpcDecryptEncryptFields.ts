import { RpcToken } from './RpcToken';

export default class RpcDecryptEncryptFields extends RpcToken {

    public readonly fields: Map<string, string>;
    public readonly passwords: Map<string, string>;

    constructor(accessToken: string, fields: Map<string, string>, passwords: Map<string, string>) {
        super(accessToken);
        this.fields = fields;
        this.passwords = passwords;
    }

}
