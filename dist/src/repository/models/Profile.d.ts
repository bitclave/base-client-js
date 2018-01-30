import Account from './Account';
export default class Profile {
    private _data;
    private _email;
    private _account;
    constructor(data: Map<string, string>, email: string, account: Account);
    readonly data: Map<string, string>;
    readonly email: string;
    readonly account: Account;
}
