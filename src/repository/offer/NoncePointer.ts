export default class NoncePointer {
    public static SEP: string = '_';

    public nonce: number;
    public transactionKey: string;

    constructor(nonce: number, transactionKey: string) {
        this.nonce = nonce;
        this.transactionKey = transactionKey;
    }

    public static generateKey(uid: string, spid: string): string {
        return uid + NoncePointer.SEP + spid;
    }

    public static getUID(key: string): string {
        return key.split(this.SEP)[0];
    }

    public static getSPID(key: string): string {
        return key.split(this.SEP)[1];
    }
}