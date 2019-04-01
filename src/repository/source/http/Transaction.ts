import { InterceptorCortege } from './InterceptorCortege';
import { Response } from './Response';

export default class Transaction {

    public readonly resolve: (value?: Response<object> | PromiseLike<Response<object>> | undefined) => void;
    public readonly reject: (value?: Response<object> | PromiseLike<Response<object>> | undefined) => void;
    public readonly cortege: InterceptorCortege;

    constructor(
        resolve: (value?: Response<object> | PromiseLike<Response<object>> | undefined) => void,
        reject: (value?: Response<object> | PromiseLike<Response<object>> | undefined) => void,
        cortege: InterceptorCortege
    ) {
        this.resolve = resolve;
        this.reject = reject;
        this.cortege = cortege;
    }

}
