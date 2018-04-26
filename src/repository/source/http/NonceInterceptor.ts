import { HttpInterceptor } from './HttpInterceptor';
import SignedRequest from './SignedRequest';
import { NonceSource } from '../NonceSource';
import { InterceptorCortege } from './InterceptorCortege';
import { MessageSigner } from '../../../utils/keypair/MessageSigner';

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
                    cortege.data.nonce = ++nonce;

                    return cortege;
                });
    }

}