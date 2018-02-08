import { HttpInterceptor } from './HttpInterceptor';
import SignedRequest from './SignedRequest';
import { MessageSigner } from '../../../utils/keypair/MessageSigner';

export default class SignInterceptor implements HttpInterceptor {

    private data: SignedRequest;
    private path: string;
    private headers: Map<string, string>;
    private messageSigner: MessageSigner;

    constructor(messageSigner: MessageSigner) {
        this.messageSigner = messageSigner;
    }

    onIntercept(path: string, headers: Map<string, string>, data: any): void {
        this.path = path;
        this.headers = headers;
        if (data != null) {
            this.data = new SignedRequest(
                data,
                this.messageSigner.getPublicKey(),
                this.messageSigner.signMessage(JSON.stringify(data))
            );
        }
    }

    getData(): any {
        return this.data;
    }

    getPath(): string {
        return this.path;
    }

    getHeaders(): Map<string, string> {
        return this.headers;
    }

}
