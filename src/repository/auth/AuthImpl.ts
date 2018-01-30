import {Auth} from './Auth';
import {HttpMethod} from '../source/HttpMethod';
import {HttpTransport} from '../source/HttpTransport';
import Account from '../models/Account';

export default class AuthImpl implements Auth {

    private readonly SIGN_UP: string = '/signUp';
    private readonly SIGN_IN: string = '/signIn';

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    signUp(address: string): Promise<Account> {
        return this.transport
            .sendRequest(this.SIGN_UP, HttpMethod.Post)
            .then((response) => Object.assign(new Account(), response.json));
    }

    signIn(id: string): Promise<Account> {
        return this.transport
            .sendRequest(this.SIGN_IN, HttpMethod.Post)
            .then((response) => Object.assign(new Account(), response.json));
    }

}
