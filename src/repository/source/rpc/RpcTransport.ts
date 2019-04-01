export declare interface RpcTransport {

    request<T>(method: string, arg?: object | string | number): Promise<T>;

    disconnect(): void;

}
