import { FileMeta } from '../../models/FileMeta';
import { HttpMethod } from './HttpMethod';
import { HttpTransportImpl } from './HttpTransportImpl';
import { InterceptorCortege } from './InterceptorCortege';
import { Response } from './Response';
import SignedRequest from './SignedRequest';
import Transaction from './Transaction';

let XMLHttpRequest: XMLHttpRequestInitializer;

if ((typeof window !== 'undefined' && window.hasOwnProperty('XMLHttpRequest'))) {
    XMLHttpRequest = (window as WindowXMLHttpRequest).XMLHttpRequest;
} else {
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
}

export class HttpTransportSyncedImpl extends HttpTransportImpl {

    private transactions: Array<Transaction> = [];

    public sendRequest<T>(method: HttpMethod, data?: object | string | number): Promise<Response<T>>;
    public sendRequest<T>(
        path: string,
        method: HttpMethod,
        data?: object | string | number,
        fileMeta?: FileMeta
    ): Promise<Response<T>> {
        return new Promise<Response<T>>((resolve, reject) => {
            const cortege: InterceptorCortege = new InterceptorCortege(path, method, this.headers, data, fileMeta);
            this.transactions.push(new Transaction(resolve, reject, cortege));

            if (this.transactions.length === 1) {
                this.runTransaction(this.transactions[0]);
            }
        });
    }

    private runTransaction(transaction: Transaction) {
        this.acceptInterceptor(transaction.cortege)
            .then((someCortege: InterceptorCortege) => new Promise<void>((resolve, reject) => {
                try {
                    const cortege: InterceptorCortege = transaction.cortege;

                    const url = cortege.path ? this.getHost() + cortege.path : this.getHost();
                    const request: XMLHttpRequest = new XMLHttpRequest();

                    request.open(cortege.method, url);

                    request.onload = () => {
                        const result: Response<object> = new Response(request.responseText, request.status);
                        if (request.status >= 200 && request.status < 300) {
                            resolve();
                            transaction.resolve(result);
                            this.callNextRequest();

                        } else {
                            resolve();
                            this.logger.error('__LOC__: Error runTransaction request', result);
                            transaction.reject(result);
                            this.callNextRequest();
                        }
                    };

                    request.onerror = () => {
                        const result: Response<object> = new Response(request.responseText, request.status);
                        this.logger.error('__LOC__: Error runTransaction onErrorRequest', result);
                        resolve();
                        transaction.reject(result);
                        this.callNextRequest();
                    };

                    if (cortege.fileMeta) {
                        this.sendMultipartData(cortege.data as SignedRequest, cortege.fileMeta, request);

                    } else {
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
