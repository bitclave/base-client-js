import { AccountRepository } from './AccountRepository';
import { HttpTransport } from '../source/http/HttpTransport';
import Account from '../models/Account';
export default class AccountRepositoryImpl implements AccountRepository {
    private readonly SIGN_UP;
    private readonly SIGN_IN;
    private transport;
    constructor(transport: HttpTransport);
    registration(account: Account): Promise<Account>;
    checkAccount(account: Account): Promise<Account>;
}
