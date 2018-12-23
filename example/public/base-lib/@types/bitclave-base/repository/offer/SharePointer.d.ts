import { TokenPointer } from './TokenPointer';
export default class SharePointer {
    static SEP: string;
    tokenPointer: TokenPointer;
    data: string;
    constructor(token: TokenPointer, data: string);
    static generateKey(uid: string, bid: string): string;
}
