import Account from './Account';
export default class Profile {
    private readonly _data;
    private readonly _account;
    constructor(data: Map<string, string>, account: Account);
    readonly data: Map<string, string>;
    readonly account: Account;
}
