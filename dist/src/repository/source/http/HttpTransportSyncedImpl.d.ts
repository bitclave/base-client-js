import { HttpMethod } from './HttpMethod';
import { HttpTransport } from './HttpTransport';
import { Response } from './Response';
import { HttpInterceptor } from './HttpInterceptor';
export declare class HttpTransportSyncedImpl implements HttpTransport {
    private interceptors;
    private transactions;
    private headers;
    private host;
    constructor(host: string);
    addInterceptor(interceptor: HttpInterceptor): HttpTransport;
    sendRequest(method: HttpMethod, data?: any): Promise<Response>;
    getHost(): string;
    private acceptInterceptor;
    private runTransaction;
    private callNextRequest;
}
