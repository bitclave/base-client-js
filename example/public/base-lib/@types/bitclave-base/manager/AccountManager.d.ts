import { AccountRepository } from '../repository/account/AccountRepository';
import Account from '../repository/models/Account';
import { KeyPairHelper } from '../utils/keypair/KeyPairHelper';
import { BehaviorSubject } from 'rxjs/Rx';
import { MessageSigner } from '../utils/keypair/MessageSigner';
export default class AccountManager {
    private accountRepository;
    private keyPairCreator;
    private messageSigner;
    private authAccountBehavior;
    constructor(auth: AccountRepository, keyPairCreator: KeyPairHelper, messageSigner: MessageSigner, authAccountBehavior: BehaviorSubject<Account>);
    /**
     * Registers a new user in the system.
     * @param {string} mnemonicPhrase Mnemonic phrase for Public/Private key pair
     * generation for asymmetric encryption scheme.
     * @param {string} message on the basis of which a signature will be created to verify the public key
     *
     * @returns {Promise<Account>} {Account} after successful registration or http exception if fail.
     */
    registration(mnemonicPhrase: string, message?: string): Promise<Account>;
    /**
     * Checks if user with provided mnemonic phrase is already registered in the system.
     * @param {string} mnemonicPhrase Mnemonic phrase for Public/Private key pair
     * generation for asymmetric encryption scheme.
     * @param {string} message on the basis of which a signature will be created to verify the public key
     *
     * @returns {Promise<Account>} {Account} if client exist or http exception if fail.
     */
    checkAccount(mnemonicPhrase: string, message?: string): Promise<Account>;
    /**
     * Allows user to unsubscribe from BASE. Delets all his data
     * @param {string} mnemonicPhrase Mnemonic phrase for Public/Private key pair
     * generation for asymmetric encryption scheme.
     *
     * @returns {Promise<Account>} {Account} if client exist or http exception if fail.
     */
    unsubscribe(mnemonicPhrase: string): Promise<Account>;
    getNewMnemonic(): Promise<string>;
    private getAccount(account, message);
    private generateAccount(keyPair);
    private onGetAccount(account, message);
}
