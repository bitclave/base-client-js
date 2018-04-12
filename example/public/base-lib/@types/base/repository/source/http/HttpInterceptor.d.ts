import InterceptorCortege from './InterceptorCortege';
export interface HttpInterceptor {
    onIntercept(cortege: InterceptorCortege): Promise<InterceptorCortege>;
}
