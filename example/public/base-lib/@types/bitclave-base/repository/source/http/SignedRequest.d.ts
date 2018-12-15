export default class SignedRequest {
    data: object;
    pk: string;
    sig: string;
    nonce: number;
    constructor(data: object, publicKey: string, sig: string, nonce: number);
}
