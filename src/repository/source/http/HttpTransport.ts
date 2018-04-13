import { HttpMethod } from './HttpMethod';
import { Response } from './Response';
import { HttpInterceptor } from './HttpInterceptor';

export declare interface HttpTransport {

    getHost(): string;

    sendRequest(method: HttpMethod, data?: any): Promise<Response>

    sendRequest(path: string, method: HttpMethod, data?: any): Promise<Response>

    addInterceptor(interceptor: HttpInterceptor): HttpTransport

}
