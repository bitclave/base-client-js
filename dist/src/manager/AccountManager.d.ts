import { AccountRepository } from '../repository/account/AccountRepository';
import Account from '../repository/models/Account';
import { KeyPairHelper } from '../utils/keypair/KeyPairHelper';
import { BehaviorSubject } from 'rxjs/Rx';
export default class AccountManager {
    private accountRepository;
    private keyPairCreator;
    private authAccountBehavior;
    constructor(auth: AccountRepository, keyPairCreator: KeyPairHelper, authAccountBehavior: BehaviorSubject<Account>);
    registration(mnemonicPhrase: string): Promise<Account>;
    checkAccount(mnemonicPhrase: string): Promise<Account>;
    private generateKeyPair(mnemonicPhrase);
    private getAccount(account);
    private generateAccount(keyPair);
    private onGetAccount(account);
}
