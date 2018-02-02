import {HttpMethod} from './HttpMethod';
import {HttpTransport} from './HttpTransport';
import Response from './Response';

let XMLHttpRequest: any;

if ((typeof window !== 'undefined' && (<any>window).XMLHttpRequest)) {
    XMLHttpRequest = (<any>window).XMLHttpRequest;
} else {
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
}

export default class HttpTransportImpl implements HttpTransport {

    private readonly HEADERS: Map<string, string> = new Map<string, string>([
        ['Accept', 'application/json'], ['Content-Type', 'application/json']]);

    private host: string;

    constructor(host: string) {
        this.host = host;
    }

    sendRequest(method: HttpMethod, data?: any): Promise<Response>
    sendRequest(path: string, method: HttpMethod, data?: any): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            try {
                const url = path ? this.getHost() + path : this.getHost();
                const request = new XMLHttpRequest();
                request.open(method, url, false);

                this.HEADERS.forEach((value, key) => {
                    request.setRequestHeader(key, value);
                });

                request.send(JSON.stringify(data));

                const result: Response = new Response(request.responseText, request.status);
                resolve(result);

            } catch (e) {
                reject(e);
            }
        });
    }

    getHost(): string {
        return this.host;
    }

}
