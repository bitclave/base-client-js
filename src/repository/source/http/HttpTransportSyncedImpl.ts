import { FileMeta } from '../../models/FileMeta';
import { JsonTransform } from '../../models/JsonTransform';
import { HttpMethod } from './HttpMethod';
import { HttpTransportImpl } from './HttpTransportImpl';
import { InterceptorCortege } from './InterceptorCortege';
import { Response } from './Response';
import SignedRequest from './SignedRequest';
import Transaction from './Transaction';

export interface XMLHttpRequestInitializer extends XMLHttpRequest {
    new(): XMLHttpRequest;
}

let HttpRequest: XMLHttpRequestInitializer;

if ((typeof window !== 'undefined' && window.hasOwnProperty('XMLHttpRequest'))) {
    // tslint:disable-next-line:no-any
    HttpRequest = (window as any).XMLHttpRequest;
} else {
    HttpRequest = require('xmlhttprequest').XMLHttpRequest;
}

export class HttpTransportSyncedImpl extends HttpTransportImpl {

    // @ts-ignore
    private transactions: Array<Transaction> = [];

    public sendRequest<T>(
        path: string,
        method: HttpMethod,
        data?: object | string | number,
        fileMeta?: FileMeta
    ): Promise<Response<T>> {
        return new Promise<Response<T>>((resolve, reject) => {
            const dataJson = (data instanceof JsonTransform) ? (data as JsonTransform).toJson() : data;
            const headers = new Map<string, string>();

            if (dataJson) {
                headers.set('Accept', 'application/json');
                headers.set('Content-Type', 'application/json');
            }

            const cortege: InterceptorCortege = new InterceptorCortege(
                path,
                method,
                headers,
                dataJson,
                data,
                fileMeta
            );
            this.transactions.push(new Transaction<T>(resolve, reject, cortege));

            if (this.transactions.length === 1) {
                this.runTransaction(this.transactions[0]);
            }
        }).catch(error => {
            this.logger.error(JSON.stringify(error));
            throw error;
        });
    }

    private runTransaction(transaction: Transaction<object>): Promise<Response<object>> {
        return new Promise<Response<object>>(async (resolve, reject) => {
            try {
                await this.acceptInterceptor(transaction.cortege);

                const cortege: InterceptorCortege = transaction.cortege;

                const url = cortege.path ? this.getHost() + cortege.path : this.getHost();
                const request = new HttpRequest();

                request.open(cortege.method, url);
                console.log(cortege.method, url);

                request.onload = () => {
                    const result: Response<object> = new Response(request.responseText, request.status);
                    if (request.status >= 200 && request.status < 300) {
                        transaction.resolve(result);
                        resolve();
                        this.callNextRequest();

                    } else {
                        this.logger.error('Error runTransaction request', result);
                        transaction.reject(result);
                        // reject(result);
                        this.callNextRequest();
                    }
                };

                request.onerror = () => {
                    console.error('request.timeout', request.timeout);
                    console.error('request.responseURL', request.responseURL);
                    const result: Response<object> = new Response(request.responseText, request.status);
                    this.logger.error('Error runTransaction onErrorRequest', result);
                    transaction.reject(result);
                    reject(result);
                    this.callNextRequest();
                };

                if (cortege.fileMeta) {
                    this.sendMultipartData(cortege.data as SignedRequest, cortege.fileMeta, request);

                } else {
                    cortege.headers.forEach((value, key) => {
                        request.setRequestHeader(key, value);
                    });

                    request.send(cortege.data ? JSON.stringify(cortege.data) : null);
                }
            } catch (e) {
                transaction.reject(e);
                reject(e);
                this.callNextRequest();
            }
        }).catch(error => {
            this.logger.error(JSON.stringify(error));
            throw error;
        });
    }

    private callNextRequest() {
        this.transactions.shift();

        if (this.transactions.length > 0) {
            this.runTransaction(this.transactions[0]);
        }
    }
}
