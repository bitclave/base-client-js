export declare class RpcToken {
    accessToken: string;
    constructor(accessToken: string);
    getAccessTokenSig(): string;
    getClearAccessToken(): string;
}
