import { HttpInterceptor } from '../http/HttpInterceptor';
import { InterceptorCortege } from '../http/InterceptorCortege';
import { RpcInterceptor } from './RpcInterceptor';
export declare class JsonRpcHttpInterceptorAdapter implements HttpInterceptor {
    private readonly rpcInterceptor;
    constructor(rpcInterceptor: RpcInterceptor);
    onIntercept(cortege: InterceptorCortege): Promise<InterceptorCortege>;
}
