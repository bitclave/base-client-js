import Account from './Account';
//import {Map} from 'immutable'

export default class Profile {

    private _data: Map<string, string>;
    private _email: string;
    private _account: Account;

    constructor(data: Map<string, string>, email: string, account: Account) {
        this._data = data;
        this._email = email;
        this._account = account;
    }

    get data(): Map<string, string> {
        return this._data as Map<string, string>;
    }

    set data(data: Map<string, string>) {
        this._data = data;
    }

    get email(): string {
        return this._email;
    }

    get account(): Account {
        return this._account;
    }

}
