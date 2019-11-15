import { Logger } from '../../../utils/BasicLogger';
import { FileMeta } from '../../models/FileMeta';
import { HttpInterceptor } from './HttpInterceptor';
import { HttpMethod } from './HttpMethod';
import { HttpTransport } from './HttpTransport';
import { InterceptorCortege } from './InterceptorCortege';
import { Response } from './Response';
import SignedRequest from './SignedRequest';
export declare class HttpTransportImpl implements HttpTransport {
    protected interceptors: Array<HttpInterceptor>;
    protected readonly host: string;
    protected readonly logger: Logger;
    constructor(host: string, loggerService?: Logger);
    addInterceptor(interceptor: HttpInterceptor): HttpTransport;
    sendRequest<T>(path: string, method: HttpMethod, data?: object | string | number, file?: FileMeta): Promise<Response<T>>;
    getHost(): string;
    protected sendMultipartData(data: SignedRequest, fileMeta: FileMeta, xhr: XMLHttpRequest): void;
    protected acceptInterceptor(interceptorCortege: InterceptorCortege): Promise<InterceptorCortege>;
}
