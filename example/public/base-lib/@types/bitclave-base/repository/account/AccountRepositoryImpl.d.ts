import { AccountRepository } from './AccountRepository';
import { HttpTransport } from '../source/http/HttpTransport';
import Account from '../models/Account';
export default class AccountRepositoryImpl implements AccountRepository {
    private readonly SIGN_UP;
    private readonly SIGN_IN;
    private readonly DELETE;
    private readonly GET_NONCE;
    private transport;
    constructor(transport: HttpTransport);
    registration(account: Account): Promise<Account>;
    checkAccount(account: Account): Promise<Account>;
    unsubscribe(account: Account): Promise<Account>;
    getNonce(account: Account): Promise<number>;
}
