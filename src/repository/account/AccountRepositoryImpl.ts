import { AccountRepository } from './AccountRepository';
import { HttpMethod } from '../source/http/HttpMethod';
import { HttpTransport } from '../source/http/HttpTransport';
import Account from '../models/Account';

export default class AccountRepositoryImpl implements AccountRepository {

    private readonly SIGN_UP: string = '/v1/registration';
    private readonly SIGN_IN: string = '/v1/exist';
    private readonly DELETE: string = '/v1/delete';
    private readonly GET_NONCE: string = '/v1/nonce/';

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    registration(account: Account): Promise<Account> {
        return this.transport
            .sendRequest(this.SIGN_UP, HttpMethod.Post, account.toSimpleAccount())
            .then((response) => Object.assign(new Account(), response.json));
    }

    checkAccount(account: Account): Promise<Account> {
        return this.transport
            .sendRequest(this.SIGN_IN, HttpMethod.Post, account.toSimpleAccount())
            .then((response) => Object.assign(new Account(), response.json));
    }

    unsubscribe(account: Account): Promise<Account> {
        return this.transport
            .sendRequest(this.DELETE, HttpMethod.Delete, account.toSimpleAccount())
            .then((response) => Object.assign(new Account(), response.json));
    }

    getNonce(account: Account): Promise<number> {
        return this.transport
            .sendRequest(this.GET_NONCE + account.publicKey, HttpMethod.Get)
            .then((response) => parseInt(response.json.toString()));
    }

}
