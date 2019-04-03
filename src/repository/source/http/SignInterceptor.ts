import { MessageSigner } from '../../../utils/keypair/MessageSigner';
import { HttpInterceptor } from './HttpInterceptor';
import { InterceptorCortege } from './InterceptorCortege';
import SignedRequest from './SignedRequest';

export default class SignInterceptor implements HttpInterceptor {

    private messageSigner: MessageSigner;

    constructor(messageSigner: MessageSigner) {
        this.messageSigner = messageSigner;
    }

    public async onIntercept(cortege: InterceptorCortege): Promise<InterceptorCortege> {
        if (cortege.data !== null && cortege.data !== undefined) {
            const sig = await this.messageSigner.signMessage(JSON.stringify(cortege.data));

            cortege.data = new SignedRequest(
                cortege.data as object,
                this.messageSigner.getPublicKey(),
                sig,
                0
            );
        }

        return cortege;
    }

}
