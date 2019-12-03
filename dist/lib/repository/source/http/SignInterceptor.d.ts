import { MessageSigner } from '../../../utils/keypair/MessageSigner';
import { HttpInterceptor } from './HttpInterceptor';
import { InterceptorCortege } from './InterceptorCortege';
export declare enum ExcludeSignatureType {
    EXCLUDE_SIG = "EXCLUDE_SIG",
    EXCLUDE_WRAPPER = "EXCLUDE_WRAPPER"
}
export declare const ExcludeSignature: (exclude?: ExcludeSignatureType) => (target: object) => void;
export default class SignInterceptor implements HttpInterceptor {
    static DECORATOR_KEY: string;
    private messageSigner;
    constructor(messageSigner: MessageSigner);
    onIntercept(cortege: InterceptorCortege): Promise<InterceptorCortege>;
}
