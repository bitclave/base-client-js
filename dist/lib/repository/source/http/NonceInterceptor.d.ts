import { MessageSigner } from '../../../utils/keypair/MessageSigner';
import { NonceSource } from '../../assistant/NonceSource';
import { HttpInterceptor } from './HttpInterceptor';
import { InterceptorCortege } from './InterceptorCortege';
export declare const ExcludeNonce: (target: object) => void;
export default class NonceInterceptor implements HttpInterceptor {
    static DECORATOR_KEY: string;
    private messageSigner;
    private nonceSource;
    constructor(messageSigner: MessageSigner, nonceSource: NonceSource);
    onIntercept(cortege: InterceptorCortege): Promise<InterceptorCortege>;
}
