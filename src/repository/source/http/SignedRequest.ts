export default class SignedRequest {
    public data: object;
    public pk: string;
    public sig: string;
    public nonce: number;

    constructor(data: object, publicKey: string, sig: string, nonce: number) {
        this.data = data;
        this.pk = publicKey;
        this.sig = sig;
        this.nonce = nonce;
    }

}
