import { HttpInterceptor } from './HttpInterceptor';
import SignedRequest from './SignedRequest';
import { MessageSigner } from '../../../utils/keypair/MessageSigner';
import { InterceptorCortege } from './InterceptorCortege';

export default class SignInterceptor implements HttpInterceptor {

    private messageSigner: MessageSigner;

    constructor(messageSigner: MessageSigner) {
        this.messageSigner = messageSigner;
    }

    public onIntercept(cortege: InterceptorCortege): Promise<InterceptorCortege> {
        return (cortege.data === null)
            ? Promise.resolve(cortege)

            : this.messageSigner.signMessage(JSON.stringify(cortege.data))
                .then(sigResult => new Promise<InterceptorCortege>(resolve => {
                    cortege.data = new SignedRequest(
                        cortege.data,
                        this.messageSigner.getPublicKey(),
                        sigResult
                    );
                    resolve(cortege);
                }));
    }

}
