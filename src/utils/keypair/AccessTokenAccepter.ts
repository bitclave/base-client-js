import { TokenType } from './rpc/RpcToken';

export interface AccessTokenAccepter {

    setAccessData(accessToken: string, tokenType: TokenType): void;
}
