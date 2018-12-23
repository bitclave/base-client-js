import { TokenPointer } from './TokenPointer';

export default class SharePointer {
    public static SEP: string = '_';

    public tokenPointer: TokenPointer;
    public data: string;

    constructor(token: TokenPointer, data: string) {
        this.tokenPointer = token;
        this.data = data;
    }

    public static generateKey(uid: string, bid: string): string {
        return uid + this.SEP + bid;
    }


}