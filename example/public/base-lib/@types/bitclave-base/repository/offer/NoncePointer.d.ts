export default class NoncePointer {
    static SEP: string;
    nonce: number;
    transactionKey: string;
    constructor(nonce: number, transactionKey: string);
    static generateKey(uid: string, spid: string): string;
    static getUID(key: string): string;
    static getSPID(key: string): string;
}
