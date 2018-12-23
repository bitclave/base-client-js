import { HttpInterceptor } from './HttpInterceptor';
import { InterceptorCortege } from './InterceptorCortege';
import { MessageSigner } from '../../../utils/keypair/MessageSigner';
import { NonceSource } from '../../assistant/NonceSource';
export default class NonceInterceptor implements HttpInterceptor {
    private messageSigner;
    private nonceSource;
    constructor(messageSigner: MessageSigner, nonceSource: NonceSource);
    onIntercept(cortege: InterceptorCortege): Promise<InterceptorCortege>;
}
