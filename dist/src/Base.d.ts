import Wallet from './repository/wallet/Wallet';
import AccountManager from './manager/AccountManager';
export default class Base {
    private _wallet;
    private _accountManager;
    constructor(host: string);
    readonly wallet: Wallet;
    readonly accountManager: AccountManager;
}
