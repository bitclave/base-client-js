import { JsonRpc } from './JsonRpc';

export interface RpcInterceptor {

    onIntercept(request: JsonRpc): Promise<JsonRpc>;
}
