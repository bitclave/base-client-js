import { JsonDeserializer } from '../../../utils/types/json-transform';
import { Primitive } from '../../../utils/types/Primitive';
import { TransportInterceptor } from '../TransportInterceptor';
import { RpcInterceptor } from './RpcInterceptor';

export declare interface RpcTransport extends TransportInterceptor<RpcInterceptor> {

    request<T>(
        method: string,
        arg?: Array<object | Primitive | undefined | null>,
        deserializer?: JsonDeserializer<T>
    ): Promise<T>;

    disconnect(): void;
}
