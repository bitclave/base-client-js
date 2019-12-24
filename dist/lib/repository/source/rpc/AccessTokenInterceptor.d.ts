import { AccessTokenAccepter } from '../../../utils/keypair/AccessTokenAccepter';
import { TokenType } from '../../../utils/keypair/rpc/RpcToken';
import { JsonRpc } from './JsonRpc';
import { RpcInterceptor } from './RpcInterceptor';
export declare class AccessTokenInterceptor implements RpcInterceptor, AccessTokenAccepter {
    private accessToken;
    private tokenType;
    constructor(accessToken?: string, tokenType?: TokenType);
    onIntercept(request: JsonRpc): Promise<JsonRpc>;
    setAccessData(accessToken: string, tokenType: TokenType): void;
}
