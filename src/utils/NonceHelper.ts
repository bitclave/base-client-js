import { HttpTransport } from '../repository/source/http/HttpTransport';
import { HttpMethod } from '../repository/source/http/HttpMethod';
import { NonceSource } from '../repository/source/NonceSource';

export default class NonceHelper implements NonceSource {

    private readonly GET_NONCE: string = '/v1/nonce/';

    private httpTransport: HttpTransport;

    constructor(httpTransport: HttpTransport) {
        this.httpTransport = httpTransport;
    }

    public getNonce(publicKey: string): Promise<number> {
        return this.httpTransport
            .sendRequest(this.GET_NONCE + publicKey, HttpMethod.Get)
            .then((response) => parseInt(response.json.toString()));
    }

}
