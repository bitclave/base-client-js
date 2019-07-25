import { MessageSigner } from '../../../utils/keypair/MessageSigner';
import { HttpInterceptor } from './HttpInterceptor';
import { InterceptorCortege } from './InterceptorCortege';
import SignedRequest from './SignedRequest';

export const excludeSignature = (target: object) =>
    Reflect.defineMetadata(SignInterceptor.DECORATOR_KEY, null, target);

export default class SignInterceptor implements HttpInterceptor {

    public static DECORATOR_KEY = 'decorator:excludeSignature';

    private messageSigner: MessageSigner;

    constructor(messageSigner: MessageSigner) {
        this.messageSigner = messageSigner;
    }

    public async onIntercept(cortege: InterceptorCortege): Promise<InterceptorCortege> {
        if (cortege.data !== null && cortege.data !== undefined) {
            let sig = '';
            let publicKey = '';

            const metaKeys = cortege.originalData && Reflect.getMetadataKeys(cortege.originalData.constructor);

            if (!metaKeys || metaKeys.length <= 0 || metaKeys.indexOf(SignInterceptor.DECORATOR_KEY) <= -1) {
                sig = await this.messageSigner.signMessage(JSON.stringify(cortege.data));
                publicKey = this.messageSigner.getPublicKey();
            }

            cortege.data = new SignedRequest(
                cortege.data as object,
                publicKey,
                sig,
                0
            );
        }

        return cortege;
    }
}
