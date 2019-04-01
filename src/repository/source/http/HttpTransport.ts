import { HttpInterceptor } from './HttpInterceptor';
import { HttpMethod } from './HttpMethod';
import { Response } from './Response';

export declare interface HttpTransport {

    getHost(): string;

    sendRequest<T>(method: HttpMethod, data?: object | string): Promise<Response<T>>;

    sendRequest<T>(path: string, method: HttpMethod, data?: object | string | number): Promise<Response<T>>;

    addInterceptor(interceptor: HttpInterceptor): HttpTransport;

}
