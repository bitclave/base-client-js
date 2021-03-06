import { BasicLogger, Logger } from '../../../utils/BasicLogger';
import { TimeMeasureLogger } from '../../../utils/TimeMeasureLogger';
import { FileMeta } from '../../models/FileMeta';
import { JsonTransform } from '../../models/JsonTransform';
import { JsonRpc } from '../rpc/JsonRpc';
import { HttpInterceptor } from './HttpInterceptor';
import { HttpMethod } from './HttpMethod';
import { HttpTransport } from './HttpTransport';
import { XMLHttpRequestInitializer } from './HttpTransportSyncedImpl';
import { InterceptorCortege } from './InterceptorCortege';
import { Response } from './Response';
import SignedRequest from './SignedRequest';

let HttpRequest: XMLHttpRequestInitializer;

if ((typeof window !== 'undefined' && window.hasOwnProperty('XMLHttpRequest'))) {
    // tslint:disable-next-line:no-any
    HttpRequest = (window as any).XMLHttpRequest;
} else {
    HttpRequest = require('xmlhttprequest').XMLHttpRequest;
}

export class HttpTransportImpl implements HttpTransport {

    protected interceptors: Array<HttpInterceptor> = [];

    protected readonly host: string;
    protected readonly logger: Logger;

    constructor(host: string, loggerService?: Logger) {
        this.host = host;
        this.logger = loggerService ? loggerService : new BasicLogger();
    }

    public addInterceptor(interceptor: HttpInterceptor): this {
        if (this.interceptors.indexOf(interceptor) === -1) {
            this.interceptors.push(interceptor);
        }

        return this;
    }

    public sendRequest<T>(
        path: string,
        method: HttpMethod,
        data?: object | string | number,
        file?: FileMeta
    ): Promise<Response<T>> {
        return new Promise<Response<T>>(async (resolve, reject) => {
            try {
                const dataJson = (data instanceof JsonTransform) ? (data as JsonTransform).toJson() : data;
                const headers = new Map<string, string>();

                if (dataJson) {
                    headers.set('Accept', 'application/json');
                    headers.set('Content-Type', 'application/json');
                }

                const cortege = await this.acceptInterceptor(new InterceptorCortege(
                    path,
                    method,
                    headers,
                    dataJson,
                    data
                ));

                const isJsonRpc = data instanceof JsonRpc;
                const logName = `request: ${cortege.method} ${cortege.path}` +
                    ` ${isJsonRpc ? `rpc method: ${(data as JsonRpc).method}` : ''}`;

                const rnd = Math.random();

                TimeMeasureLogger.time(logName, rnd);
                const url = cortege.path ? this.getHost() + cortege.path : this.getHost();
                const request: XMLHttpRequest = new HttpRequest();
                request.open(method, url);

                request.onload = () => {
                    TimeMeasureLogger.timeEnd(logName, rnd);
                    const result: Response<T> = new Response(request.responseText, request.status);
                    if (request.status >= 200 && request.status < 300) {
                        resolve(result);

                    } else {
                        reject(result);
                    }
                };

                request.onerror = () => {
                    TimeMeasureLogger.timeEnd(logName, rnd);
                    const result: Response<object> = new Response(request.responseText, request.status);
                    reject(result);
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
                reject(e);
            }
        }).catch(error => {
            this.logger.error(JSON.stringify(error));
            throw error;
        });
    }

    public getHost(): string {
        return this.host;
    }

    protected sendMultipartData(data: SignedRequest, fileMeta: FileMeta, xhr: XMLHttpRequest) {
        const dataForm = {
            signature: JSON.stringify(data),
            data: fileMeta,
        };

        const boundary = String(Math.random()).slice(2);
        const boundaryMiddle = '--' + boundary + '\r\n';
        const boundaryLast = '--' + boundary + '--\r\n';

        const body = ['\r\n'];
        for (const key in dataForm) {
            if (dataForm[key] instanceof FileMeta) {
                const file: FileMeta = dataForm[key] as FileMeta;
                body.push(
                    `content-disposition: form-data; name="${key}"; ` +
                    `filename="${file.name}"\r\n` +
                    `content-type: ${file.mimeType}\r\n` +
                    `\r\n${file.content}\r\n`
                );

            } else {
                body.push('content-disposition: form-data; name="' + key + '"\r\n\r\n' + dataForm[key] + '\r\n');
            }
        }
        const result = body.join(boundaryMiddle) + boundaryLast;
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
        xhr.send(result);
    }

    protected async acceptInterceptor(interceptorCortege: InterceptorCortege): Promise<InterceptorCortege> {
        let cortege = interceptorCortege;

        const rnd = Math.random();

        TimeMeasureLogger.time(`http->callAllInterceptors`, rnd);

        for (const interceptor of this.interceptors) {
            const rnd1 = Math.random();
            // @ts-ignore
            TimeMeasureLogger.time(`call interceptor by name ${interceptor.__proto__.constructor.name}`, rnd1);
            cortege = await interceptor.onIntercept(cortege);
            // @ts-ignore
            TimeMeasureLogger.timeEnd(`call interceptor by name ${interceptor.__proto__.constructor.name}`, rnd1);
        }
        TimeMeasureLogger.timeEnd(`http->callAllInterceptors`, rnd);
        return cortege;
    }
}
