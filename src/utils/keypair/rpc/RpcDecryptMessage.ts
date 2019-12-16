import { RpcToken } from './RpcToken';

export default class RpcDecryptMessage extends RpcToken {

    public readonly senderPk: string;
    public readonly encrypted: string;

    constructor(senderPk: string, encrypted: string) {
        super();
        this.senderPk = senderPk;
        this.encrypted = encrypted;
    }

}
