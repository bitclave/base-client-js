export enum TokenType {
    BASIC = 0,
    KEYCLOACK_JWT = 1,
}

export class RpcToken {

    public accessToken: string;
    public tokenType: TokenType;

    constructor(accessToken: string = '', tokenType: TokenType = TokenType.BASIC) {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
    }

    public getAccessTokenSig(): string {
        return this.accessToken.substring(32);
    }

    public getClearAccessToken(): string {
        return this.accessToken.substring(0, 32);
    }
}
