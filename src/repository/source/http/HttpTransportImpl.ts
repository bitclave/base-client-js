import { HttpMethod } from './HttpMethod';
import { HttpTransport } from './HttpTransport';
import { Response } from './Response';
import { HttpInterceptor } from './HttpInterceptor';
import { InterceptorCortege } from './InterceptorCortege';

// const FormData = require('form-data');
const req = require('request');
const fs = require('fs');
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
        return this.acceptInterceptor(new InterceptorCortege(path, method, this.headers, false, data))
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

    sendBlobRequest(path: string, method: HttpMethod, headers: Map<string, string>, data?: any, file?: File): Promise<Response> {
        return this.acceptInterceptor(new InterceptorCortege(path, method, headers, true, data, file))
            .then((cortege: InterceptorCortege) => new Promise<Response>((resolve, reject) => {
                try {
                    const url = cortege.path ? this.getHost() + cortege.path : this.getHost();
                    if(cortege.blobRequest) {
                        if(cortege.file) {
                            var formData = {
                                signature: JSON.stringify(cortege.data ? cortege.data : {}),
                                data: cortege.file,
                            };

                            req.post({url:url, formData: formData}, function optionalCallback(err: any, httpResponse: any, body: any) {
                                if (err) {
                                    const result: Response = new Response(err, httpResponse.statusCode);
                                    reject(result);
                                } else {
                                    const result: Response = new Response(body, httpResponse.statusCode);
                                    if (result.status >= 200 && result.status < 300) {
                                        resolve(result);
        
                                    } else {
                                        reject(result);
                                    }
                                }
                            }); 
                        } else {
                            let r = req.get({url:url, body:JSON.stringify(cortege.data ? cortege.data : {})}).on('response', function(res:any) {
                                    var filename: string = '', contentDisp = res.headers['content-disposition'];
                                    if (contentDisp && /^attachment/i.test(contentDisp)) {
                                        filename = contentDisp.toLowerCase()
                                            .split('filename=')[1]
                                            .split(';')[0]
                                            .replace(/"/g, '');
                                    }
                                    let stream = r.pipe(fs.createWriteStream(`./${filename}`));

                                    stream.on("finish", function() {
                                        const file = fs.readFileSync(`./${filename}`);
                                        const result: Response = new Response(file, res.statusCode);
                                        if (result.status >= 200 && result.status < 300) {
                                            resolve(result);
            
                                        } else {
                                            reject(result);
                                        } 
                                    });
                                }
                            ); 
                        }
                    } else {
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
                    }
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
