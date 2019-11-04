import Account from '../models/Account';

export interface AccountRepository {

    registration(account: Account): Promise<Account>;

    checkAccount(account: Account): Promise<Account>;

    isRegistered(account: Account): Promise<boolean>;

    unsubscribe(account: Account): Promise<void>;

    getNonce(account: Account): Promise<number>;
}
