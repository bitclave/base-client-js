import { MessageSigner } from '../../../utils/keypair/MessageSigner';
import { TimeMeasureLogger } from '../../../utils/TimeMeasureLogger';
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
        TimeMeasureLogger.time('NonceInterceptor all');

        if ((cortege.data instanceof SignedRequest) && cortege.isTransaction()) {
            TimeMeasureLogger.time('NonceInterceptor reflection');
            const metaKeys = cortege.originalData && Reflect.getMetadataKeys(cortege.originalData.constructor);
            TimeMeasureLogger.timeEnd('NonceInterceptor reflection');

            if (!metaKeys || metaKeys.length <= 0 || metaKeys.indexOf(NonceInterceptor.DECORATOR_KEY) <= -1) {
                TimeMeasureLogger.time('NonceInterceptor getNonce');
                const nonce = await this.nonceSource.getNonce(this.messageSigner.getPublicKey());
                TimeMeasureLogger.timeEnd('NonceInterceptor getNonce');

                (cortege.data as SignedRequest).nonce = nonce + 1;
            }
        }
        TimeMeasureLogger.timeEnd('NonceInterceptor all');

        return cortege;
    }
}
