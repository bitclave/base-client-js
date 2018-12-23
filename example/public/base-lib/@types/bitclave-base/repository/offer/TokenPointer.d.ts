declare class TokenPointer {
    static SEP: string;
    token: Token;
    signature: string;
    constructor(token: Token, signature: string);
    static generateKey(bid: string, spid: string): string;
    static getBID(key: string): string;
    static getSPID(key: string): string;
    static conform(value: string): boolean;
}
declare class Token {
    bid: string;
    nonce: number;
    dataHash: string;
    timestamp: string;
    transactionKey: string;
    constructor(bid: string, nonce: number, dataHash: string, timestamp: string, transactionKey: string);
    static conform(obj: Token): boolean;
}
export { TokenPointer, Token };
