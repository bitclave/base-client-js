import { HttpMethod } from './HttpMethod';
import { HttpTransport } from './HttpTransport';
import { Response } from './Response';
import { HttpInterceptor } from './HttpInterceptor';
import { InterceptorCortege } from './InterceptorCortege';
import Transaction from './Transaction';

const FormData = require('form-data');
const req = require('request');
let XMLHttpRequest: any;

if ((typeof window !== 'undefined' && (<any> window).XMLHttpRequest)) {
    XMLHttpRequest = (<any> window).XMLHttpRequest;
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
    sendRequest(method: HttpMethod, data?: any): Promise<Response>;
    sendRequest(path: string, method: HttpMethod, data?: any): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            const cortege: InterceptorCortege = new InterceptorCortege(path, method, this.headers, data);
            this.transactions.push(new Transaction(resolve, reject, cortege));

            if (this.transactions.length === 1) {
                this.runTransaction(this.transactions[0]);
            }
        });
    }

    sendBlobRequest(path: string, method: HttpMethod, headers: Map<string, string>, data?: any, file?: File): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            const cortege: InterceptorCortege = new InterceptorCortege(path, method, headers, data, file);
            this.transactions.push(new Transaction(resolve, reject, cortege));
            if (this.transactions.length === 1) {
                this.runTransaction(this.transactions[0]);
            }
        });
    }

    getHost(): string {
        return this.host;
    }
    private acceptInterceptor(interceptorCortege: InterceptorCortege, interceptorIndex: number = 0): Promise<InterceptorCortege> {
        return (interceptorIndex >= this.interceptors.length)
            ? Promise.resolve(interceptorCortege)
            : this.interceptors[interceptorIndex].onIntercept(interceptorCortege).then(interceptorCortegeResult =>
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

                    if(cortege.file) {
                        // const formData = new FormData();
                        // formData.append('data', cortege.file, { filename : 'test.png' });
                        // formData.append('signature', JSON.stringify(cortege.data ? cortege.data : {}));

                        // request.open(cortege.method, url, true);
                        // request.send(formData); 
                        var formData = {
                            signature: JSON.stringify(cortege.data ? cortege.data : {}),
                            data: cortege.file,
                          };

                        let _this = this;
                        req.post({url:url, formData: formData}, function optionalCallback(err: any, httpResponse: any, body: any) {
                            if (err) {
                                const result: Response = new Response(err, httpResponse.statusCode);
                                reject();
                                transaction.reject(result);
                                _this.callNextRequest();
                            } else {
                                const result: Response = new Response(body, httpResponse.statusCode);
                                if (result.status >= 200 && result.status < 300) {
                                    resolve();
                                    transaction.resolve(result);
                                    _this.callNextRequest();
    
                                } else {
                                    reject();
                                    transaction.reject(result);
                                    _this.callNextRequest();
                                }
                            }
                        }); 
                    } else {
                        request.open(cortege.method, url);

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

                        cortege.headers.forEach((value, key) => {
                            request.setRequestHeader(key, value);
                        });
                        request.send(JSON.stringify(cortege.data ? cortege.data : {}));
                    }
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
