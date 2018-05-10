import { RpcToken } from './RpcToken';

export default class RpcEncryptMessage extends RpcToken {

    recipientPk: string;
    message: string;

    constructor(accessToken: string, recipientPk: string, message: string) {
        super(accessToken);
        this.recipientPk = recipientPk;
        this.message = message;
    }

}
