import { InterceptorCortege } from './InterceptorCortege';
export default class Transaction {
    resolve: Function;
    reject: Function;
    cortege: InterceptorCortege;
    constructor(resolve: Function, reject: Function, cortege: InterceptorCortege);
}
