import { RpcToken } from './RpcToken';

export default class RpcDecryptEncryptFields extends RpcToken {

    public readonly fields: Map<string, string>;
    public readonly passwords: Map<string, string>;

    constructor(fields: Map<string, string>, passwords: Map<string, string>) {
        super();
        this.fields = fields;
        this.passwords = passwords;
    }
}
