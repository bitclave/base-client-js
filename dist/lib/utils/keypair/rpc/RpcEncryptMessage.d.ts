import { RpcToken } from './RpcToken';
export default class RpcEncryptMessage extends RpcToken {
    readonly recipientPk: string;
    readonly message: string;
    constructor(recipientPk: string, message: string);
}
