import Wallet from './repository/wallet/Wallet';
import AccountManager from './manager/AccountManager';
export default class Base {
    wallet: Wallet;
    account: AccountManager;
    constructor(host: string);
}
