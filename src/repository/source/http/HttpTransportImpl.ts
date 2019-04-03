import { BasicLogger, Logger } from '../../../utils/BasicLogger';
import { FileMeta } from '../../models/FileMeta';
import { HttpInterceptor } from './HttpInterceptor';
import { HttpMethod } from './HttpMethod';
import { HttpTransport } from './HttpTransport';
import { InterceptorCortege } from './InterceptorCortege';
import { Response } from './Response';
import SignedRequest from './SignedRequest';

let XMLHttpRequest: XMLHttpRequestInitializer;

if ((typeof window !== 'undefined' && window.hasOwnProperty('XMLHttpRequest'))) {
    XMLHttpRequest = (window as WindowXMLHttpRequest).XMLHttpRequest;
} else {
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
}

export class HttpTransportImpl implements HttpTransport {

    protected interceptors: Array<HttpInterceptor> = [];

    protected headers: Map<string, string> = new Map<string, string>(
        [
            ['Accept', 'application/json'], ['Content-Type', 'application/json']
        ]
    );

    protected readonly host: string;
    protected readonly logger: Logger;

    constructor(host: string, loggerService?: Logger) {
        this.host = host;
        this.logger = loggerService ? loggerService : new BasicLogger();
    }

    public addInterceptor(interceptor: HttpInterceptor): HttpTransport {
        if (this.interceptors.indexOf(interceptor) === -1) {
            this.interceptors.push(interceptor);
        }

        return this;
    }

    public sendRequest<T>(method: HttpMethod, data?: object | string): Promise<Response<T>>;
    public sendRequest<T>(
        path: string,
        method: HttpMethod,
        data?: object | string | number,
        file?: FileMeta
    ): Promise<Response<T>> {
        return this.acceptInterceptor(new InterceptorCortege(path, method, this.headers, data))
            .then((cortege: InterceptorCortege) => new Promise<Response<T>>((resolve, reject) => {
                try {
                    const url = cortege.path ? this.getHost() + cortege.path : this.getHost();
                    const request: XMLHttpRequest = new XMLHttpRequest();
                    request.open(method, url);

                    request.onload = () => {
                        const result: Response<object> = new Response(request.responseText, request.status);
                        if (request.status >= 200 && request.status < 300) {
                            resolve(result);

                        } else {
                            reject(result);
                        }
                    };
                    request.onerror = () => {
                        const result: Response<object> = new Response(request.responseText, request.status);
                        reject(result);
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
                    reject(e);
                }
            }));
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

    protected acceptInterceptor(
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
}
