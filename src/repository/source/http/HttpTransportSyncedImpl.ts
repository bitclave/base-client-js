import { HttpMethod } from './HttpMethod';
import { HttpTransport } from './HttpTransport';
import { Response } from './Response';
import { HttpInterceptor } from './HttpInterceptor';
import { InterceptorCortege } from './InterceptorCortege';
import Transaction from './Transaction';

let XMLHttpRequest: any;

if ((typeof window !== 'undefined' && (<any>window).XMLHttpRequest)) {
    XMLHttpRequest = (<any>window).XMLHttpRequest;
} else {
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
}

export class HttpTransportSyncedImpl implements HttpTransport {

    private interceptors: Array<HttpInterceptor> = [];
    private transactions: Array<Transaction> = [];

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

    private acceptInterceptor(interceptorCortege: InterceptorCortege,
                              interceptorIndex: number = 0): Promise<InterceptorCortege> {
        return (interceptorIndex >= this.interceptors.length)
            ? Promise.resolve(interceptorCortege)

            : this.interceptors[interceptorIndex]
                .onIntercept(interceptorCortege)
                .then(interceptorCortegeResult =>
                    this.acceptInterceptor(interceptorCortegeResult, ++interceptorIndex)
                );
    }

    sendRequest(method: HttpMethod, data?: any): Promise<Response>
    sendRequest(path: string, method: HttpMethod, data?: any): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            const cortege: InterceptorCortege = new InterceptorCortege(path, method, this.headers, data);
            this.transactions.push(new Transaction(resolve, reject, cortege));

            if (this.transactions.length == 1) {
                this.runTransaction(this.transactions[0]);
            }
        });
    }

    getHost(): string {
        return this.host;
    }

    private runTransaction(transaction: Transaction) {
        this.acceptInterceptor(transaction.cortege)
            .then((cortege: InterceptorCortege) => new Promise<void>((resolve, reject) => {
                try {
                    const cortege: InterceptorCortege = transaction.cortege;

                    const url = cortege.path ? this.getHost() + cortege.path : this.getHost();
                    const request: XMLHttpRequest = new XMLHttpRequest();
                    request.open(cortege.method, url);

                    cortege.headers.forEach((value, key) => {
                        request.setRequestHeader(key, value);
                    });

                    request.onload = () => {
                        const result: Response = new Response(request.responseText, request.status);
                        if (request.status >= 200 && request.status < 300) {
                            resolve();
                            transaction.resolve(result);
                            this.callNextRequest();

                        } else {
                            reject();
                            transaction.reject(result);
                            this.callNextRequest();
                        }
                    };

                    request.onerror = () => {
                        const result: Response = new Response(request.responseText, request.status);
                        reject();
                        transaction.reject(result);
                        this.callNextRequest();
                    };

                    request.send(JSON.stringify(cortege.data ? cortege.data : {}));
                } catch (e) {
                    reject();
                    transaction.reject(e);
                    this.callNextRequest();
                }
            }));
    }

    private callNextRequest() {
        this.transactions.shift();

        if (this.transactions.length > 0) {
            this.runTransaction(this.transactions[0]);
        }
    }

}
