import Account from './Account';
export default class Profile {
    private _data;
    private _account;
    constructor(data: Map<string, string>, account: Account);
    readonly data: Map<string, string>;
    readonly account: Account;
}
