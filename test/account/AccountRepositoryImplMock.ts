import { AccountRepository } from '../../src/repository/account/AccountRepository';
import Account from '../../src/repository/models/Account';

export default class AccountRepositoryImplMock implements AccountRepository {
    public getNonce(account: Account): Promise<number> {
        return new Promise<number>(resolve => resolve(1));
    }

    public registration(account: Account): Promise<Account> {
        return new Promise<Account>(resolve => resolve(account));
    }

    public checkAccount(account: Account): Promise<Account> {
        return new Promise<Account>(resolve => resolve(account));
    }

    public unsubscribe(account: Account): Promise<Account> {
        return new Promise<Account>(resolve => resolve(account));
    }

}
