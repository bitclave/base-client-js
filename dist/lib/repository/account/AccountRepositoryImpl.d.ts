import Account from '../models/Account';
import { HttpTransport } from '../source/http/HttpTransport';
import { AccountRepository } from './AccountRepository';
export default class AccountRepositoryImpl implements AccountRepository {
    private readonly SIGN_UP;
    private readonly SIGN_IN;
    private readonly LAZY_REGISTRATION;
    private readonly DELETE;
    private readonly GET_NONCE;
    private transport;
    constructor(transport: HttpTransport);
    registration(account: Account): Promise<Account>;
    lazyRegistration(account: Account): Promise<Account>;
    checkAccount(account: Account): Promise<Account>;
    unsubscribe(account: Account): Promise<void>;
    getNonce(account: Account): Promise<number>;
}
