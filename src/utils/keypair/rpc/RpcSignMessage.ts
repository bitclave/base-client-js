import { RpcToken } from './RpcToken';

export default class RpcSignMessage extends RpcToken {

    public readonly message: string;

    constructor(message: string, accessToken: string) {
        super(accessToken);
        this.message = message;
    }

}
