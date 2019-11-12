import { RpcToken } from './RpcToken';

export default class RpcEncryptMessage extends RpcToken {

    public readonly recipientPk: string;
    public readonly message: string;

    constructor(recipientPk: string, message: string) {
        super();
        this.recipientPk = recipientPk;
        this.message = message;
    }

}
