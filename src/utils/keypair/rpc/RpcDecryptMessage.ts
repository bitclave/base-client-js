import { RpcToken } from './RpcToken';

export default class RpcDecryptMessage extends RpcToken {

    senderPk: string;
    encrypted: string;

    constructor(accessToken: string, senderPk: string, encrypted: string) {
        super(accessToken);
        this.senderPk = senderPk;
        this.encrypted = encrypted;
    }

}
