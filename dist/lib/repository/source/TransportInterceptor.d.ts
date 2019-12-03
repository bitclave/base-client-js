export interface TransportInterceptor<InterceptorType> {
    addInterceptor(interceptor: InterceptorType): this;
}
