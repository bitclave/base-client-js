import { RpcToken } from './RpcToken';

export default class RpcDecryptMessage extends RpcToken {

    public readonly senderPk: string;
    public readonly encrypted: string;

    constructor(accessToken: string, senderPk: string, encrypted: string) {
        super(accessToken);
        this.senderPk = senderPk;
        this.encrypted = encrypted;
    }

}
