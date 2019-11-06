import { RpcToken } from './RpcToken';

export class RpcAuth extends RpcToken {

    public readonly passPhrase: string;
    public readonly origin: string;
    public readonly expireDate: Date;

    constructor(
        accessToken: string = '',
        passPhrase: string = '',
        origin: string = '',
        expireDate: Date = new Date()
    ) {
        super(accessToken);
        this.passPhrase = passPhrase;
        this.origin = origin;
        this.expireDate = expireDate;
    }
}
