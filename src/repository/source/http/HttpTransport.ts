import {HttpMethod} from './HttpMethod';
import Response from './Response'

export interface HttpTransport {

    getHost(): string;

    sendRequest(method: HttpMethod, data?: any): Promise<Response>

    sendRequest(path: string, method: HttpMethod, data?: any): Promise<Response>

}
