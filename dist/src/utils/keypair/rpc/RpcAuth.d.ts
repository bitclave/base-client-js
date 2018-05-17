import { RpcToken } from './RpcToken';
export declare class RpcAuth extends RpcToken {
    passPhrase: string;
    origin: string;
    expireDate: string;
    constructor(accessToken?: string, passPhrase?: string, origin?: string, expireDate?: string);
}
