import { RpcToken } from './RpcToken';
export default class RpcSignMessage extends RpcToken {
    readonly message: string;
    constructor(message: string);
}
