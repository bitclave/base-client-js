import { AccountRepository } from '../repository/account/AccountRepository';
import Profile from '../repository/models/Profile';
import Account from '../repository/models/Account';
import KeyPair from '../utils/keypair/KeyPair';
import CryptoUtils from '../utils/CryptoUtils';
import { KeyPairCreator } from '../utils/keypair/KeyPairCreator';
import { BehaviorSubject } from 'rxjs/Rx';

export default class AccountManager {

    private accountRepository: AccountRepository;
    private profile: Profile;
    private keyPairCreator: KeyPairCreator;
    private authAccountBehavior: BehaviorSubject<Account>;

    constructor(auth: AccountRepository,
                keyPairCreator: KeyPairCreator,
                authAccountBehavior: BehaviorSubject<Account>) {
        this.accountRepository = auth;
        this.keyPairCreator = keyPairCreator;
        this.authAccountBehavior = authAccountBehavior;
    }

    signUp(mnemonicPhrase: string): Promise<Account> {
        return this.generateKeyPair(mnemonicPhrase)
            .then(this.generateAccount)
            .then((account) => this.accountRepository.signUp(account))
            .then(account => this.onGetAccount(account, mnemonicPhrase));
    }

    signIn(mnemonicPhrase: string): Promise<Account> {
        return this.generateKeyPair(mnemonicPhrase)
            .then(this.generateAccount)
            .then((account: Account) => this.getAccount(mnemonicPhrase, account));
    }

    getProfile(): Profile {
        return this.profile;
    }

    hasActiveAccount(): boolean {
        return this.profile != null && this.profile.account != null;
    }

    private generateKeyPair(mnemonicPhrase: string): Promise<KeyPair> {
        return new Promise<KeyPair>(resolve => {
            resolve(this.keyPairCreator.createKeyPair(mnemonicPhrase));
        });
    }

    private getAccount(secretKey: string, account: Account): Promise<Account> {
        return this.accountRepository.loadAccount(secretKey)
            .catch(reason => this.accountRepository.signIn(account))
            .then((account: Account) => this.onGetAccount(account, secretKey));
    }

    private generateAccount(keyPair: KeyPair): Promise<Account> {
        return new Promise<Account>((resolve) => {
            const hash: string = CryptoUtils.keccak256(keyPair.privateKey + keyPair.publicKey);
            resolve(new Account(keyPair.publicKey, hash));
        });
    }

    private onGetAccount(account: Account, secretKey: string): Promise<Account> {
        return this.accountRepository.saveAccount(account, secretKey)
            .then((account: Account) => {
                this.authAccountBehavior.next(account);
                return account;
            });

    }

}
