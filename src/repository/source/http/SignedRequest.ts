export default class SignedRequest {
    data: object;
    pk: string;
    sig: string;
    nonce: number;

    constructor(data: object, publicKey: string, sig: string, nonce: number) {
        this.data = data;
        this.pk = publicKey;
        this.sig = sig;
        this.nonce = nonce;
    }

}
