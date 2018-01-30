import { HttpMethod } from './HttpMethod';
import { HttpTransport } from './HttpTransport';
import Response from './Response';
export default class HttpTransportImpl implements HttpTransport {
    private readonly HEADERS;
    private host;
    constructor(host: string);
    sendRequest(method: HttpMethod, data?: any): Promise<Response>;
    getHost(): string;
}
