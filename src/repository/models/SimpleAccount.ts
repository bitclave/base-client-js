export default class SimpleAccount {

    public publicKey: string = '';
    public nonce: number = 0;

    constructor(publicKey: string = '', nonce: number = 0) {
        this.publicKey = publicKey;
        this.nonce = nonce;
    }

}
