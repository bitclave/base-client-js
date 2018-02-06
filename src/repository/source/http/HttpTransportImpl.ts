import { HttpMethod } from './HttpMethod';
import { HttpTransport } from './HttpTransport';
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
                const request: XMLHttpRequest = new XMLHttpRequest();
                request.open(method, url);

                this.HEADERS.forEach((value, key) => {
                    request.setRequestHeader(key, value);
                });

                request.onload = () => {
                    const result: Response = new Response(request.responseText, request.status);
                    if (request.status >= 200 && request.status < 300) {
                        resolve(result);

                    } else {
                        reject(result);
                    }
                };

                request.onerror = () => {
                    const result: Response = new Response(request.responseText, request.status);
                    reject(result);
                };

                request.send(JSON.stringify(data ? data : {}));
            } catch (e) {
                reject(e);
            }
        });
    }

    getHost(): string {
        return this.host;
    }

}
