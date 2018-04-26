import { HttpInterceptor } from './HttpInterceptor';
import { NonceSource } from '../NonceSource';
import { InterceptorCortege } from './InterceptorCortege';
import { MessageSigner } from '../../../utils/keypair/MessageSigner';
export default class NonceInterceptor implements HttpInterceptor {
    private messageSigner;
    private nonceSource;
    constructor(messageSigner: MessageSigner, nonceSource: NonceSource);
    onIntercept(cortege: InterceptorCortege): Promise<InterceptorCortege>;
}
