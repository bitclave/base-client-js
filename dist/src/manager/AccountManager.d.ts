import { Auth } from '../repository/auth/Auth';
import Account from '../repository/models/Account';
import { ClientData } from '../repository/client/ClientData';
import Profile from '../repository/models/Profile';
export default class AccountManager {
    private auth;
    private clientData;
    private profile;
    constructor(auth: Auth, clientData: ClientData);
    signUp(address: string): Promise<Account>;
    signIn(id: string): Promise<Account>;
    getProfile(): Profile;
    hasActiveAccount(): boolean;
    private onGetAccount(account);
}
