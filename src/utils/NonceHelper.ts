import { HttpTransport } from '../repository/source/http/HttpTransport';
import { HttpMethod } from '../repository/source/http/HttpMethod';
import { NonceSource } from '../repository/source/NonceSource';

export default class NonceHelper implements NonceSource {

    private httpTransport: HttpTransport;

    constructor(httpTransport: HttpTransport) {
        this.httpTransport = httpTransport;
    }

    public getNonce(publicKey: string): Promise<number> {
        return this.httpTransport
            .sendRequest('/v1/nonce/' + publicKey, HttpMethod.Get)
            .then((response) => parseInt(response.json.toString()));
    }

}
