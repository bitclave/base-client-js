interface Transport {
    sendRequest<T>(method: string, data: object, c: {
        new (): T;
    }): Promise<T>;
}
