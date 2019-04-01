import { MessageSigner } from '../../../utils/keypair/MessageSigner';
import { NonceSource } from '../../assistant/NonceSource';
import { HttpInterceptor } from './HttpInterceptor';
import { InterceptorCortege } from './InterceptorCortege';
import SignedRequest from './SignedRequest';

export default class NonceInterceptor implements HttpInterceptor {

    private messageSigner: MessageSigner;
    private nonceSource: NonceSource;

    constructor(messageSigner: MessageSigner, nonceSource: NonceSource) {
        this.messageSigner = messageSigner;
        this.nonceSource = nonceSource;
    }

    public onIntercept(cortege: InterceptorCortege): Promise<InterceptorCortege> {
        return !(cortege.data instanceof SignedRequest) && !cortege.isTransaction()
               ? Promise.resolve(cortege)

               : this.nonceSource.getNonce(this.messageSigner.getPublicKey())
                   .then(nonce => {
                       (cortege.data as SignedRequest).nonce = ++nonce;

                       return cortege;
                   });
    }

}
