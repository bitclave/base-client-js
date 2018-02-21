import { AccountRepository } from '../../src/repository/account/AccountRepository';

export default class AccountRepositoryImplMock implements AccountRepository {

    registration(account: Account): Promise<Account> {
        return new Promise<Account>(resolve => resolve(account));
    }

    checkAccount(account: Account): Promise<Account> {
        return new Promise<Account>(resolve => resolve(account));
    }

}
