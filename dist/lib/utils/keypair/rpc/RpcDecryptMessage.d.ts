import { RpcToken } from './RpcToken';
export default class RpcDecryptMessage extends RpcToken {
    readonly senderPk: string;
    readonly encrypted: string;
    constructor(senderPk: string, encrypted: string);
}
