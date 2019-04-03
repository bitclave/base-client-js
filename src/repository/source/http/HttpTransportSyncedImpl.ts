import { BasicLogger, Logger } from '../../../utils/BasicLogger';
import { HttpInterceptor } from './HttpInterceptor';
import { HttpMethod } from './HttpMethod';
import { HttpTransport } from './HttpTransport';
import { InterceptorCortege } from './InterceptorCortege';
import { Response } from './Response';
import Transaction from './Transaction';

let XMLHttpRequest: XMLHttpRequestInitializer;

if ((typeof window !== 'undefined' && window.hasOwnProperty('XMLHttpRequest'))) {
    XMLHttpRequest = (window as WindowXMLHttpRequest).XMLHttpRequest;
} else {
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
}

export class HttpTransportSyncedImpl implements HttpTransport {

    private interceptors: Array<HttpInterceptor> = [];
    private transactions: Array<Transaction> = [];

    private headers: Map<string, string> = new Map<string, string>(
        [
            ['Accept', 'application/json'], ['Content-Type', 'application/json']
        ]
    );

    private readonly host: string;

    private logger: Logger;

    constructor(host: string, loggerService: Logger) {
        this.host = host;
        if (!loggerService) {
            loggerService = new BasicLogger();
        }

        this.logger = loggerService;
    }

    public addInterceptor(interceptor: HttpInterceptor): HttpTransport {
        if (this.interceptors.indexOf(interceptor) === -1) {
            this.interceptors.push(interceptor);
        }

        return this;
    }

    public sendRequest<T>(method: HttpMethod, data?: object | string | number): Promise<Response<T>>;
    public sendRequest<T>(path: string, method: HttpMethod, data?: object | string | number): Promise<Response<T>> {
        return new Promise<Response<T>>((resolve, reject) => {
            const cortege: InterceptorCortege = new InterceptorCortege(path, method, this.headers, data);
            this.transactions.push(new Transaction(resolve, reject, cortege));

            if (this.transactions.length === 1) {
                this.runTransaction(this.transactions[0]);
            }
        });
    }

    public getHost(): string {
        return this.host;
    }

    private acceptInterceptor(
        interceptorCortege: InterceptorCortege,
        interceptorIndex: number = 0
    ): Promise<InterceptorCortege> {
        return (interceptorIndex >= this.interceptors.length)
               ? Promise.resolve(interceptorCortege)
               : this.interceptors[interceptorIndex]
                   .onIntercept(interceptorCortege)
                   .then(interceptorCortegeResult =>
                             this.acceptInterceptor(interceptorCortegeResult, ++interceptorIndex)
                   );
    }

    private runTransaction(transaction: Transaction) {
        this.acceptInterceptor(transaction.cortege)
            .then((someCortege: InterceptorCortege) => new Promise<void>((resolve, reject) => {
                try {
                    const cortege: InterceptorCortege = transaction.cortege;

                    const url = cortege.path ? this.getHost() + cortege.path : this.getHost();
                    const request: XMLHttpRequest = new XMLHttpRequest();

                    const _this = this;
                    request.open(cortege.method, url);

                    request.onload = () => {
                        const result: Response<object> = new Response(request.responseText, request.status);
                        if (request.status >= 200 && request.status < 300) {
                            resolve();
                            transaction.resolve(result);
                            this.callNextRequest();

                        } else {
                            resolve();
                            _this.logger.error('Error runTransaction request', result);
                            transaction.reject(result);
                            this.callNextRequest();
                        }
                    };

                    request.onerror = () => {
                        const result: Response<object> = new Response(request.responseText, request.status);
                        _this.logger.error('Error runTransaction onErrorRequest', result);
                        resolve();
                        transaction.reject(result);
                        this.callNextRequest();
                    };

                    cortege.headers.forEach((value, key) => {
                        request.setRequestHeader(key, value);
                    });
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
