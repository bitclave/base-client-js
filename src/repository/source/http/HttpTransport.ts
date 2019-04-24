import { FileMeta } from '../../models/FileMeta';
import { HttpInterceptor } from './HttpInterceptor';
import { HttpMethod } from './HttpMethod';
import { Response } from './Response';

export interface HttpTransport {

    getHost(): string;

    sendRequest<T>(
        path: string,
        method: HttpMethod,
        data?: object | string | number,
        file?: FileMeta
    ): Promise<Response<T>>;

    addInterceptor(interceptor: HttpInterceptor): HttpTransport;

}
