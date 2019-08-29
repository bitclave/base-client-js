import { InterceptorCortege } from './InterceptorCortege';
import { Response } from './Response';

export default class Transaction<T> {

    public readonly resolve: (value?: Response<T> | PromiseLike<Response<T>> | undefined) => void;
    public readonly reject: (value?: Response<T> | PromiseLike<Response<T>> | undefined) => void;
    public readonly cortege: InterceptorCortege;

    constructor(
        resolve: (value?: Response<T> | PromiseLike<Response<T>> | undefined) => void,
        reject: (value?: Response<T> | PromiseLike<Response<T>> | undefined) => void,
        cortege: InterceptorCortege
    ) {
        this.resolve = resolve;
        this.reject = reject;
        this.cortege = cortege;
    }

}
