import {Auth} from '../repository/auth/Auth';
import {ClientData} from '../repository/client/ClientData';
import Account from '../repository/models/Account';

export default class AccountManager {

    private auth: Auth;
    private clientData: ClientData;

    constructor(auth: Auth, clientData: ClientData) {
        this.auth = auth;
        this.clientData = profile;
    }

    signUp(): Promise<Account> {

    }

    signIn(id: string): Promise<Account> {

    }


    hasActiveAccount(): boolean {

    }

}
