export enum TokenType {
    BASIC = 'BASIC',
    KEYCLOACK_JWT = 'KEYCLOACK_JWT',
}

export class RpcAuthData {

    public readonly data: string;
    public readonly type: TokenType = TokenType.BASIC;

    constructor(data: string, type: TokenType) {
        this.data = data;
        this.type = type;
    }
}
