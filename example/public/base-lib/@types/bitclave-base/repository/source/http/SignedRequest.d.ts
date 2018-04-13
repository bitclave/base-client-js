export default class SignedRequest {
    data: object;
    pk: string;
    sig: string;
    constructor(data: object, publicKey: string, sig: string);
}
