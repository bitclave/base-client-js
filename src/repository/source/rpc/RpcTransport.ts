export interface RpcTransport {

    request(method: string, arg: any): Promise<any>

    disconnect(): void;

}
