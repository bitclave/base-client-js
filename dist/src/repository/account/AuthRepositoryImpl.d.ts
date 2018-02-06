import { AccountRepository } from './AccountRepository';
import { HttpTransport } from '../source/http/HttpTransport';
import Account from '../models/Account';
import { Storage } from '../source/storage/Storage';
export default class AccountRepositoryImpl implements AccountRepository {
    private readonly SIGN_UP;
    private readonly SIGN_IN;
    private readonly STORAGE_ACCOUNT_KEY;
    private transport;
    private storage;
    constructor(transport: HttpTransport, storage: Storage);
    signUp(account: Account): Promise<Account>;
    signIn(account: Account): Promise<Account>;
    saveAccount(account: Account, secretKey: string): Promise<Account>;
    loadAccount(secretKey: string): Promise<Account>;
}
