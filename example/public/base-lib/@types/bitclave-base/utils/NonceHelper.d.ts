import { HttpTransport } from '../repository/source/http/HttpTransport';
import { NonceSource } from '../repository/source/NonceSource';
export default class NonceHelper implements NonceSource {
    private readonly GET_NONCE;
    private httpTransport;
    constructor(httpTransport: HttpTransport);
    getNonce(publicKey: string): Promise<number>;
}
