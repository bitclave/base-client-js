export declare interface RpcTransport {

    request<T>(method: string, arg: object): Promise<T>;

    disconnect(): void;

}
