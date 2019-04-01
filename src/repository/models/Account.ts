import SimpleAccount from './SimpleAccount';

export default class Account extends SimpleAccount {

    public message: string = '';
    public sig: string = '';

    public static fromJson(json: object): Account {
        return Object.assign(new Account(), json);
    }

    constructor(publicKey: string = '', nonce: number = 0) {
        super(publicKey, nonce);
    }

    public toSimpleAccount() {
        return new SimpleAccount(this.publicKey, this.nonce);
    }

}
