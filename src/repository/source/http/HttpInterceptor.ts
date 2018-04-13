import { InterceptorCortege } from './InterceptorCortege';

export declare interface HttpInterceptor {

    onIntercept(cortege: InterceptorCortege): Promise<InterceptorCortege>

}
