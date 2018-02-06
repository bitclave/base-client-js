import { AccountRepository } from '../repository/account/AccountRepository';
import Profile from '../repository/models/Profile';
import Account from '../repository/models/Account';
import { KeyPairCreator } from '../utils/keypair/KeyPairCreator';
import { BehaviorSubject } from 'rxjs/Rx';
export default class AccountManager {
    private accountRepository;
    private profile;
    private keyPairCreator;
    private authAccountBehavior;
    constructor(auth: AccountRepository, keyPairCreator: KeyPairCreator, authAccountBehavior: BehaviorSubject<Account>);
    signUp(mnemonicPhrase: string): Promise<Account>;
    signIn(mnemonicPhrase: string): Promise<Account>;
    getProfile(): Profile;
    hasActiveAccount(): boolean;
    private generateKeyPair(mnemonicPhrase);
    private getAccount(secretKey, account);
    private generateAccount(keyPair);
    private onGetAccount(account, secretKey);
}
