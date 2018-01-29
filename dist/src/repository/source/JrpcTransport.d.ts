export default class JrpcTransport implements HttpTransport {
    sendRequest<T>(method: string, data: Object, clazz: {
        new (): T;
    }): Promise<T>;
}
