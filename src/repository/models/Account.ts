import SimpleAccount from './SimpleAccount';

export default class Account extends SimpleAccount {

    message: string = '';
    sig: string = '';

    constructor(publicKey: string = '', nonce: number = 0) {
        super(publicKey, nonce);
    }

    public toSimpleAccount() {
        return new SimpleAccount(this.publicKey, this.nonce);
    }

    public static fromJson(json: any): Account {
        const account: Account = Object.assign(new Account(), json);
        return account;
    }

}
