import { RpcToken } from './RpcToken';
export default class RpcCheckSignature extends RpcToken {
    readonly msg: string;
    readonly sig: string;
    constructor(msg?: string, sig?: string, accessToken?: string);
}
