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

    public onIntercept(path: string, headers: Map<string, string>, data: any): Promise<void> {
        return new Promise(async resolve => {
            this.path = path;
            this.headers = headers;
            if (data != null) {
                const sig = await this.messageSigner.signMessage(JSON.stringify(data));
                this.data = new SignedRequest(
                    data,
                    this.messageSigner.getPublicKey(),
                    sig
                );
            }
            resolve();
        });
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
