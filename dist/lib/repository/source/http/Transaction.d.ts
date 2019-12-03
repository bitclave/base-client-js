import { InterceptorCortege } from './InterceptorCortege';
import { Response } from './Response';
export default class Transaction<T> {
    readonly resolve: (value?: Response<T> | PromiseLike<Response<T>> | undefined) => void;
    readonly reject: (value?: Response<T> | PromiseLike<Response<T>> | undefined) => void;
    readonly cortege: InterceptorCortege;
    constructor(resolve: (value?: Response<T> | PromiseLike<Response<T>> | undefined) => void, reject: (value?: Response<T> | PromiseLike<Response<T>> | undefined) => void, cortege: InterceptorCortege);
}
