import { DeepCopy } from './DeepCopy';

export default class SimpleAccount extends DeepCopy<SimpleAccount> {

    public publicKey: string = '';
    public nonce: number = 0;

    constructor(publicKey: string = '', nonce: number = 0) {
        super();
        this.publicKey = publicKey;
        this.nonce = nonce;
    }

}
