import { MessageSigner } from '../../../utils/keypair/MessageSigner';
import { HttpInterceptor } from './HttpInterceptor';
import { InterceptorCortege } from './InterceptorCortege';
import SignedRequest from './SignedRequest';

export enum ExcludeSignatureType {
    EXCLUDE_SIG = 'EXCLUDE_SIG',
    EXCLUDE_WRAPPER = 'EXCLUDE_WRAPPER'
}

export const ExcludeSignature = (exclude: ExcludeSignatureType = ExcludeSignatureType.EXCLUDE_SIG) =>
    (target: object) => Reflect.defineMetadata(SignInterceptor.DECORATOR_KEY, exclude, target);

export default class SignInterceptor implements HttpInterceptor {

    public static DECORATOR_KEY = 'decorator:ExcludeSignature';

    private messageSigner: MessageSigner;

    constructor(messageSigner: MessageSigner) {
        this.messageSigner = messageSigner;
    }

    public async onIntercept(cortege: InterceptorCortege): Promise<InterceptorCortege> {
        if (cortege.data) {
            let sig = '';
            let publicKey = '';

            const metaKeys = cortege.originalData && Reflect.getMetadataKeys(cortege.originalData.constructor);

            if (!metaKeys || metaKeys.length <= 0 || metaKeys.indexOf(SignInterceptor.DECORATOR_KEY) <= -1) {
                sig = await this.messageSigner.signMessage(JSON.stringify(cortege.data));
                publicKey = this.messageSigner.getPublicKey();

            } else {
                const metaData = Reflect.getMetadata(SignInterceptor.DECORATOR_KEY, cortege.originalData!.constructor);

                if (ExcludeSignatureType[metaData as string] === ExcludeSignatureType.EXCLUDE_WRAPPER) {
                    return cortege;
                }
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
