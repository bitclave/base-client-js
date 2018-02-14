import { AccountRepository } from '../repository/account/AccountRepository';
import Account from '../repository/models/Account';
import KeyPair from '../utils/keypair/KeyPair';
import { KeyPairHelper } from '../utils/keypair/KeyPairHelper';
import { BehaviorSubject } from 'rxjs/Rx';

export default class AccountManager {

    private accountRepository: AccountRepository;
    private keyPairCreator: KeyPairHelper;
    private authAccountBehavior: BehaviorSubject<Account>;

    constructor(auth: AccountRepository,
                keyPairCreator: KeyPairHelper,
                authAccountBehavior: BehaviorSubject<Account>) {
        this.accountRepository = auth;
        this.keyPairCreator = keyPairCreator;
        this.authAccountBehavior = authAccountBehavior;
    }

    registration(mnemonicPhrase: string): Promise<Account> {
        return this.generateKeyPair(mnemonicPhrase)
            .then(this.generateAccount)
            .then((account) => this.accountRepository.registration(account))
            .then(this.onGetAccount.bind(this));
    }

    checkAccount(mnemonicPhrase: string): Promise<Account> {
        return this.generateKeyPair(mnemonicPhrase)
            .then(this.generateAccount)
            .then(this.getAccount.bind(this));
    }

    private generateKeyPair(mnemonicPhrase: string): Promise<KeyPair> {
        return new Promise<KeyPair>(resolve => {
            resolve(this.keyPairCreator.createKeyPair(mnemonicPhrase));
        });
    }

    private getAccount(account: Account): Promise<Account> {
        return this.accountRepository.checkAccount(account)
            .then(this.onGetAccount.bind(this));
    }

    private generateAccount(keyPair: KeyPair): Promise<Account> {
        return new Promise<Account>((resolve) => {
            resolve(new Account(keyPair.publicKey));
        });
    }

    private onGetAccount(account: Account): Account {
        this.authAccountBehavior.next(account);

        return account;
    }

}
