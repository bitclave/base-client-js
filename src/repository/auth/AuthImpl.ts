import { Auth } from './Auth';
import { HttpMethod } from '../source/http/HttpMethod';
import { HttpTransport } from '../source/http/HttpTransport';
import Account from '../models/Account';
import { Storage } from '../source/storage/Storage';

export default class AuthImpl implements Auth {

    private readonly SIGN_UP: string = '/signUp';
    private readonly SIGN_IN: string = '/signIn';

    private readonly STORAGE_ACCOUNT_KEY: string = 'base_account';

    private transport: HttpTransport;
    private storage: Storage;

    constructor(transport: HttpTransport, storage: Storage) {
        this.transport = transport;
        this.storage = storage;
    }

    signUp(account: Account): Promise<Account> {
        return this.transport
            .sendRequest(this.SIGN_UP, HttpMethod.Post, account)
            .then((response) => Object.assign(new Account(), response.json));
    }

    signIn(account: Account): Promise<Account> {
        return this.transport
            .sendRequest(this.SIGN_IN, HttpMethod.Post, account)
            .then((response) => Object.assign(new Account(), response.json));
    }

    saveAccount(account: Account, secretKey: string): Promise<Account> {
        return new Promise<Account>(resolve => {
            const encrypted = JSON.stringify(account); // will be encrypted
            this.storage.setItem(this.STORAGE_ACCOUNT_KEY, encrypted);
            resolve(account);
        });
    }

    loadAccount(secretKey: string): Promise<Account> {
        return new Promise<Account>((resolve, reject) => {
            const decrypted: string = this.storage.getItem(this.STORAGE_ACCOUNT_KEY);
            const account: Account = Object.assign(new Account(), JSON.parse(decrypted));

            if (account.id.length == 64) {
                resolve(account);
            } else {
                reject();
            }
        });
    }

}
