import { RpcToken } from './RpcToken';

export class RpcAuth extends RpcToken {

    passPhrase: string;
    origin: string;
    expireDate: string;

    constructor(accessToken: string = '',
                passPhrase: string = '',
                origin: string = '',
                expireDate: string = '') {
        super(accessToken);
        this.passPhrase = passPhrase;
        this.origin = origin;
        this.expireDate = expireDate;
    }

}
