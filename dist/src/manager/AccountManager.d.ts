import { Auth } from '../repository/auth/Auth';
import { ClientData } from '../repository/client/ClientData';
import Profile from '../repository/models/Profile';
import Account from '../repository/models/Account';
export default class AccountManager {
    private auth;
    private clientData;
    private profile;
    constructor(auth: Auth, clientData: ClientData);
    signUp(mnemonicPhrase: string): Promise<Account>;
    signIn(mnemonicPhrase: string): Promise<Account>;
    getProfile(): Profile;
    hasActiveAccount(): boolean;
    private generateKeyPair(mnemonicPhrase);
    private getAccount(secretKey, account);
    private generateAccount(keyPair);
    private onGetAccount(account, secretKey);
}
