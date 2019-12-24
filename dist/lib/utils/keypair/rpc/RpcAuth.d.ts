import { RpcToken } from './RpcToken';
export declare class RpcAuth extends RpcToken {
    readonly passPhrase: string;
    readonly origin: string;
    readonly expireDate: string;
    constructor(accessToken?: string, passPhrase?: string, origin?: string, expireDate?: string);
}
