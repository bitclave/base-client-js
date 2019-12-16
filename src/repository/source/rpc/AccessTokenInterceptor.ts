import { AccessTokenAccepter } from '../../../utils/keypair/AccessTokenAccepter';
import { RpcToken, TokenType } from '../../../utils/keypair/rpc/RpcToken';
import { JsonRpc } from './JsonRpc';
import { RpcInterceptor } from './RpcInterceptor';

export class AccessTokenInterceptor implements RpcInterceptor, AccessTokenAccepter {

    constructor(private accessToken: string = '', private tokenType: TokenType = TokenType.BASIC) {
    }

    public async onIntercept(request: JsonRpc): Promise<JsonRpc> {
        if (request.params.length > 0 && request.params[0] instanceof RpcToken) {
            const rpcToken = request.params[0] as RpcToken;

            rpcToken.accessToken = this.accessToken;
            rpcToken.tokenType = this.tokenType;

        } else {
            request.params.splice(0, 0, [this.accessToken, this.tokenType]);
        }

        return request;
    }

    public setAccessData(accessToken: string, tokenType: TokenType): void {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
    }
}
