import { Observable } from 'rxjs';
import Account from '../repository/models/Account';
import { TokenType } from '../utils/keypair/rpc/RpcToken';

export interface AccountManager {

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
     * @returns {Promise<void>} void if client exist or http exception if fail.
     */
    unsubscribe(): Promise<void>;

    getNewMnemonic(): Promise<string>;

    getAccount(): Account;

    getPublicKeyFromMnemonic(mnemonicPhrase: string): Promise<string>;

}
