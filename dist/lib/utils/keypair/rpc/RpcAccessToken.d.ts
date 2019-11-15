export declare class RpcAccessToken {
    readonly passPhrase: string;
    readonly origin: Array<string>;
    readonly expireDate: Date;
    constructor(passPhrase?: string, origin?: Array<string>, expireDate?: Date);
}
