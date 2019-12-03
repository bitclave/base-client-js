import { FileMeta } from '../../models/FileMeta';
import { HttpMethod } from './HttpMethod';
import { HttpTransportImpl } from './HttpTransportImpl';
import { Response } from './Response';
export interface XMLHttpRequestInitializer extends XMLHttpRequest {
    new (): XMLHttpRequest;
}
export declare class HttpTransportSyncedImpl extends HttpTransportImpl {
    private transactions;
    sendRequest<T>(path: string, method: HttpMethod, data?: object | string | number, fileMeta?: FileMeta): Promise<Response<T>>;
    private runTransaction;
    private callNextRequest;
}
