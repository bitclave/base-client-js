import { KeyPairHelper } from './KeyPairHelper';
export default class KeyPairFactory {
    static getDefaultKeyPairCreator(): KeyPairHelper;
    static getRpcKeyPairCreator(client: any): KeyPairHelper;
}
