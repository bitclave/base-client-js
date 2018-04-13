import { HttpInterceptor } from './HttpInterceptor';
import { MessageSigner } from '../../../utils/keypair/MessageSigner';
import { InterceptorCortege } from './InterceptorCortege';
export default class SignInterceptor implements HttpInterceptor {
    private messageSigner;
    constructor(messageSigner: MessageSigner);
    onIntercept(cortege: InterceptorCortege): Promise<InterceptorCortege>;
}
