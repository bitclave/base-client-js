import { AccountRepository } from '../repository/account/AccountRepository';
import Account from '../repository/models/Account';
import { KeyPairHelper } from '../utils/keypair/KeyPairHelper';
import { BehaviorSubject } from 'rxjs';
export default class AccountManager {
    private accountRepository;
    private keyPairCreator;
    private authAccountBehavior;
    constructor(auth: AccountRepository, keyPairCreator: KeyPairHelper, authAccountBehavior: BehaviorSubject<Account>);
    /**
     * Registers a new user in the system.
     * @param {string} mnemonicPhrase Mnemonic phrase for Public/Private key pair
     * generation for asymmetric encryption scheme.
     *
     * @returns {Promise<Account>} {Account} after successful registration or http exception if fail.
     */
    registration(mnemonicPhrase: string): Promise<Account>;
    /**
     * Checks if user with provided mnemonic phrase is already registered in the system.
     * @param {string} mnemonicPhrase Mnemonic phrase for Public/Private key pair
     * generation for asymmetric encryption scheme.
     *
     * @returns {Promise<Account>} {Account} if client exist or http exception if fail.
     */
    checkAccount(mnemonicPhrase: string): Promise<Account>;
    private generateKeyPair(mnemonicPhrase);
    private getAccount(account);
    private generateAccount(keyPair);
    private onGetAccount(account);
}
