import { HttpMethod } from './HttpMethod';
import { HttpTransport } from './HttpTransport';
import { Response } from './Response';
import { HttpInterceptor } from './HttpInterceptor';
export declare class HttpTransportImpl implements HttpTransport {
    private interceptors;
    private headers;
    private host;
    constructor(host: string);
    addInterceptor(interceptor: HttpInterceptor): HttpTransport;
    sendRequest(path: string, method: HttpMethod, data?: any): Promise<Response>;
    getHost(): string;
    private acceptInterceptor;
}
