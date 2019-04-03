import { MessageSigner } from '../../../utils/keypair/MessageSigner';
import { HttpInterceptor } from './HttpInterceptor';
import { InterceptorCortege } from './InterceptorCortege';
import SignedRequest from './SignedRequest';

export default class SignInterceptor implements HttpInterceptor {

    private messageSigner: MessageSigner;

    constructor(messageSigner: MessageSigner) {
        this.messageSigner = messageSigner;
    }

    public onIntercept(cortege: InterceptorCortege): Promise<InterceptorCortege> {
        return (cortege.data === null || cortege.data === undefined)
               ? Promise.resolve(cortege)
               : this.messageSigner.signMessage(JSON.stringify(cortege.data))
                   .then(sigResult => new Promise<InterceptorCortege>(resolve => {
                       cortege.data = new SignedRequest(
                           cortege.data as object,
                           this.messageSigner.getPublicKey(),
                           sigResult,
                           0
                       );
                       resolve(cortege);
                   }));
    }

}
