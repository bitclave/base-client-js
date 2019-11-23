import { Primitive } from '../../../utils/types/Primitive';
import { RpcInterceptor } from './RpcInterceptor';

export declare interface RpcTransport {

    request<T>(method: string, arg?: Array<object | Primitive>): Promise<T>;

    addInterceptor(interceptor: RpcInterceptor): this;

    disconnect(): void;
}
