export class RpcToken {

    public readonly accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    public getAccessTokenSig(): string {
        return this.accessToken.substring(32);
    }

    public getClearAccessToken(): string {
        return this.accessToken.substring(0, 32);
    }

}
