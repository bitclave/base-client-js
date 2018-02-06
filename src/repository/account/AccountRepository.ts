import Account from '../models/Account';

export interface AccountRepository {

    signUp(account: Account): Promise<Account>

    signIn(account: Account): Promise<Account>

    saveAccount(account: Account, secretKey: string): Promise<Account>

    loadAccount(secretKey: string): Promise<Account>

}
