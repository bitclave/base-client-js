import { HttpMethod } from './HttpMethod';
import { HttpTransport } from './HttpTransport';
import { Response } from './Response';
import { HttpInterceptor } from './HttpInterceptor';
import { InterceptorCortege } from './InterceptorCortege';

let XMLHttpRequest: any;

if ((typeof window !== 'undefined' && (<any> window).XMLHttpRequest)) {
    XMLHttpRequest = (<any> window).XMLHttpRequest;
} else {
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
}

export class HttpTransportImpl implements HttpTransport {

    private interceptors: Array<HttpInterceptor> = [];

    private headers: Map<string, string> = new Map<string, string>([
        ['Accept', 'application/json'], ['Content-Type', 'application/json']
    ]);

    private host: string;

    constructor(host: string) {
        this.host = host;
    }

    addInterceptor(interceptor: HttpInterceptor): HttpTransport {
        if (this.interceptors.indexOf(interceptor) === -1) {
            this.interceptors.push(interceptor);
        }

        return this;
    }

    // sendRequest(method: HttpMethod, data?: any): Promise<Response>
    sendRequest(path: string, method: HttpMethod, data?: any): Promise<Response> {
        return this.acceptInterceptor(new InterceptorCortege(path, method, this.headers, data))
            .then((cortege: InterceptorCortege) => new Promise<Response>((resolve, reject) => {
                try {
                    const url = cortege.path ? this.getHost() + cortege.path : this.getHost();
                    const request: XMLHttpRequest = new XMLHttpRequest();
                    request.open(method, url);

                    cortege.headers.forEach((value, key) => {
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

                    request.send(JSON.stringify(cortege.data ? cortege.data : {}));
                } catch (e) {
                    reject(e);
                }
            }));
    }

    getHost(): string {
        return this.host;
    }

    private acceptInterceptor(interceptorCortege: InterceptorCortege, interceptorIndex: number = 0): Promise<InterceptorCortege> {
        return (interceptorIndex >= this.interceptors.length)
            ? Promise.resolve(interceptorCortege)
            : this.interceptors[interceptorIndex]
                  .onIntercept(interceptorCortege)
                  .then(interceptorCortegeResult =>
                      this.acceptInterceptor(interceptorCortegeResult, ++interceptorIndex)
                  );
    }
}
