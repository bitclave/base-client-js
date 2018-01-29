interface HttpTransport {

    sendRequest<T>(method: string, data: object, clazz: {new(): T; }): Promise<T>

}
