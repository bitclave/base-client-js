export declare enum TokenType {
    BASIC = 0,
    KEYCLOACK_JWT = 1
}
export declare class RpcToken {
    accessToken: string;
    tokenType: TokenType;
    constructor(accessToken?: string, tokenType?: TokenType);
    getAccessTokenSig(): string;
    getClearAccessToken(): string;
}
