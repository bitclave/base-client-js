import { HttpInterceptor } from '../http/HttpInterceptor';
import { InterceptorCortege } from '../http/InterceptorCortege';
import { JsonRpc } from './JsonRpc';
import { RpcInterceptor } from './RpcInterceptor';

export class JsonRpcHttpInterceptorAdapter implements HttpInterceptor {

    constructor(private readonly rpcInterceptor: RpcInterceptor) {
    }

    public async onIntercept(cortege: InterceptorCortege): Promise<InterceptorCortege> {
        cortege.data = await this.rpcInterceptor.onIntercept(cortege.data as JsonRpc);

        return cortege;
    }
}
