import { HttpMethod } from './HttpMethod';
import Response from './Response';
import { HttpTransport } from './HttpTransport';
export default class HttpTransportImpl implements HttpTransport {
    private readonly HEADERS;
    private host;
    constructor(host: string);
    sendRequest(method: HttpMethod, data?: any): Promise<Response>;
    getHost(): string;
}
