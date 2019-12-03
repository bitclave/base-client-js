import { BehaviorSubject, Observable } from 'rxjs';
import { AccountRepository } from '../repository/account/AccountRepository';
import Account from '../repository/models/Account';
import { Logger } from '../utils/BasicLogger';
import { KeyPairHelper } from '../utils/keypair/KeyPairHelper';
import { MessageSigner } from '../utils/keypair/MessageSigner';
import { TokenType } from '../utils/keypair/rpc/RpcToken';
import { AccountManager } from './AccountManager';
export declare class AccountManagerImpl implements AccountManager {
    private readonly accountRepository;
    private readonly keyPairCreator;
    private readonly messageSigner;
    private readonly authAccountBehavior;
    private readonly logger;
    constructor(accountRepository: AccountRepository, keyPairCreator: KeyPairHelper, messageSigner: MessageSigner, authAccountBehavior: BehaviorSubject<Account>, loggerService?: Logger);
    /**
     * @return {Observable<Account>} subscription to {Account}
     */
    subscribeAccount(): Observable<Account>;
    /**
     * Checks or Register user with provided mnemonic phrase is already registered in the system.
     * @param {string} passPhrase Mnemonic phrase for Public/Private key pair
     * generation for asymmetric encryption scheme.
     * @param {string} message on the basis of which a signature will be created to verify the public key
     *
     * @returns {Promise<Account>} {Account} if client exist or create new user.
     */
    authenticationByPassPhrase(passPhrase: string, message: string): Promise<Account>;
    /**
     * Checks if user with provided access token is already registered in the system.
     * @param {string} accessToken token for authenticate on remote signer
     * (if {@link KeyPairHelper} support {@link AccessTokenAccepter})
     *
     * @param {string} message on the basis of which a signature will be created to verify the public key
     *
     * @param {TokenType} tokenType type of token
     *
     * @returns {Promise<Account>} {Account} if client exist or http exception if fail.
     */
    authenticationByAccessToken(accessToken: string, tokenType: TokenType, message: string): Promise<Account>;
    /**
     * Registers a new user in the system.
     * @param {string} mnemonicPhrase Mnemonic phrase for Public/Private key pair
     * generation for asymmetric encryption scheme.
     * @param {string} message on the basis of which a signature will be created to verify the public key
     *
     * @returns {Promise<Account>} {Account} after successful registration or http exception if fail.
     */
    registration(mnemonicPhrase: string, message: string): Promise<Account>;
    /**
     * Checks if user with provided mnemonic phrase is already registered in the system.
     * @param {string} mnemonicPhrase Mnemonic phrase for Public/Private key pair
     * generation for asymmetric encryption scheme.
     * @param {string} message on the basis of which a signature will be created to verify the public key
     *
     * @returns {Promise<Account>} {Account} if client exist or http exception if fail.
     */
    checkAccount(mnemonicPhrase: string, message: string): Promise<Account>;
    /**
     * Allows user to unsubscribe from BASE. Delets all his data
     *
     * @returns {Promise<event>} void if client exist or http exception if fail.
     */
    unsubscribe(): Promise<void>;
    getNewMnemonic(): Promise<string>;
    getAccount(): Account;
    getPublicKeyFromMnemonic(mnemonicPhrase: string): Promise<string>;
    private lazyRegistration;
    private checkSigMessage;
    private syncAccount;
    private generateAccount;
    private onGetAccount;
}
