import { MessageSigner } from '../../../utils/keypair/MessageSigner';
import { NonceSource } from '../../assistant/NonceSource';
import { HttpInterceptor } from './HttpInterceptor';
import { InterceptorCortege } from './InterceptorCortege';
import SignedRequest from './SignedRequest';

export const ExcludeNonce = (target: object) =>
    Reflect.defineMetadata(NonceInterceptor.DECORATOR_KEY, null, target);

export default class NonceInterceptor implements HttpInterceptor {

    public static DECORATOR_KEY = 'decorator:ExcludeNonce';

    private messageSigner: MessageSigner;
    private nonceSource: NonceSource;

    constructor(messageSigner: MessageSigner, nonceSource: NonceSource) {
        this.messageSigner = messageSigner;
        this.nonceSource = nonceSource;
    }

    public async onIntercept(cortege: InterceptorCortege): Promise<InterceptorCortege> {
        if ((cortege.data instanceof SignedRequest) && cortege.isTransaction()) {
            const metaKeys = cortege.originalData && Reflect.getMetadataKeys(cortege.originalData.constructor);

            if (!metaKeys || metaKeys.length <= 0 || metaKeys.indexOf(NonceInterceptor.DECORATOR_KEY) <= -1) {
                const nonce = await this.nonceSource.getNonce(this.messageSigner.getPublicKey());
                (cortege.data as SignedRequest).nonce = nonce + 1;
            }
        }

        return cortege;
    }
}
