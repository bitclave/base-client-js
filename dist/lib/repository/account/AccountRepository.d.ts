import Account from '../models/Account';
export interface AccountRepository {
    registration(account: Account): Promise<Account>;
    lazyRegistration(account: Account): Promise<Account>;
    checkAccount(account: Account): Promise<Account>;
    unsubscribe(account: Account): Promise<void>;
    getNonce(account: Account): Promise<number>;
}
