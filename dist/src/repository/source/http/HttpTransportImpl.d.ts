import { HttpMethod } from './HttpMethod';
import { HttpTransport } from './HttpTransport';
import Response from './Response';
import { HttpInterceptor } from './HttpInterceptor';
export default class HttpTransportImpl implements HttpTransport {
    private interceptors;
    private headers;
    private host;
    constructor(host: string);
    addInterceptor(interceptor: HttpInterceptor): HttpTransport;
    sendRequest(method: HttpMethod, data?: any): Promise<Response>;
    getHost(): string;
}
