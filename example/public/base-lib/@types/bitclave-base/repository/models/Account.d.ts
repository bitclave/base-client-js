import SimpleAccount from './SimpleAccount';
export default class Account extends SimpleAccount {
    message: string;
    sig: string;
    constructor(publicKey?: string, nonce?: number);
    toSimpleAccount(): SimpleAccount;
}
