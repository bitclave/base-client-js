import { RpcInterceptor } from './RpcInterceptor';

export declare interface RpcTransport {

    request<T>(method: string, arg?: object | string | number): Promise<T>;

    addInterceptor(interceptor: RpcInterceptor): this;

    disconnect(): void;
}
